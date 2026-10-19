-- All temporary messages and deletions are rolled back.
begin;
do $$
declare members uuid[];
begin
  select array_agg(user_id) into members from (select user_id from public.backstage_profiles order by user_id limit 2) p;
  if coalesce(array_length(members,1),0) < 2 then raise exception 'Two profiles required'; end if;
  perform set_config('test.delete_owner',members[1]::text,true);
  perform set_config('test.delete_other',members[2]::text,true);
  perform set_config('test.delete_id',gen_random_uuid()::text,true);
  insert into public.backstage_chat_messages(id,user_id,user_name,text)
    select current_setting('test.delete_id')::uuid,user_id,username,'Rollback-only deletion check'
    from public.backstage_profiles where user_id=members[1];
  perform set_config('request.jwt.claim.sub',members[2]::text,true);
end $$;
set local role authenticated;
do $$
declare removed uuid;
begin
  delete from public.backstage_chat_messages where id=current_setting('test.delete_id')::uuid returning id into removed;
  if removed is not null then raise exception 'Other member deleted comment'; end if;
  if not exists(select 1 from public.backstage_chat_messages where id=current_setting('test.delete_id')::uuid) then raise exception 'Comment disappeared'; end if;
  perform set_config('request.jwt.claim.sub',current_setting('test.delete_owner'),true);
  delete from public.backstage_chat_messages where id=current_setting('test.delete_id')::uuid returning id into removed;
  if removed is distinct from current_setting('test.delete_id')::uuid then raise exception 'Owner delete failed'; end if;
  if exists(select 1 from public.backstage_chat_messages where id=removed) then raise exception 'Deleted comment remains readable'; end if;
end $$;
set local role anon;
do $$
begin
  begin
    delete from public.backstage_chat_messages where id=current_setting('test.delete_id')::uuid;
    raise exception 'Guest deletion permitted';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: owner deletion succeeds, other members and guests cannot delete. All test changes rolled back.' as result;
