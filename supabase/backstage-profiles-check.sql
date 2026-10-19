-- Transactional checks: no test profiles or preference changes are kept.
begin;
do $$
declare members uuid[];
begin
  select array_agg(id) into members from (
    select id from auth.users where id not in (select user_id from public.backstage_profiles) order by created_at limit 2
  ) candidates;
  if coalesce(array_length(members,1),0) < 2 then
    raise exception 'Two accounts without profiles are needed for this rollback-only check';
  end if;
  perform set_config('test.member_one',members[1]::text,true);
  perform set_config('test.member_two',members[2]::text,true);
  perform set_config('request.jwt.claim.sub',members[1]::text,true);
end $$;
set local role authenticated;
do $$
declare count_visible integer;
begin
  insert into public.backstage_profiles(user_id,username)
    values(auth.uid(),'qa_profile_check_1')
    on conflict(user_id) do update set user_id=excluded.user_id,username=excluded.username;
  insert into public.backstage_profiles(user_id,username)
    values(auth.uid(),'qa_profile_check_renamed')
    on conflict(user_id) do update set user_id=excluded.user_id,username=excluded.username;
  if not exists(select 1 from public.backstage_profiles where username='qa_profile_check_renamed') then
    raise exception 'Own profile upsert failed';
  end if;
  begin
    update public.backstage_profiles set username='BAD NAME' where user_id=auth.uid();
    raise exception 'Invalid username was accepted';
  exception when check_violation then null; end;
  begin
    insert into public.backstage_profiles(user_id,username)
      values(current_setting('test.member_two')::uuid,'qa_other_member');
    raise exception 'Cross-account insert was allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.backstage_profiles set user_id=current_setting('test.member_two')::uuid where user_id=auth.uid();
    raise exception 'Profile ownership could be transferred';
  exception when insufficient_privilege then null; end;
  perform set_config('request.jwt.claim.sub',current_setting('test.member_two'),true);
  select count(*) into count_visible from public.backstage_profiles;
  if count_visible <> 0 then raise exception 'Another member profile is visible'; end if;
  update public.backstage_profiles set username='qa_unauthorized' where user_id=current_setting('test.member_one')::uuid;
  if found then raise exception 'Cross-account update was allowed'; end if;
  begin
    insert into public.backstage_profiles(user_id,username) values(auth.uid(),'qa_profile_check_renamed');
    raise exception 'Duplicate username was accepted';
  exception when unique_violation then null; end;
end $$;
set local role anon;
do $$
begin
  begin
    perform 1 from public.backstage_profiles;
    raise exception 'Anonymous access was allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: own save/rename, uniqueness, format, ownership and private access; all test writes rolled back' as result;
