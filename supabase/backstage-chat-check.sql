-- Rollback-only integration checks; no messages are published or retained.
begin;
do $$
declare members uuid[]; no_profile uuid;
begin
  select array_agg(user_id) into members from (select user_id from public.backstage_profiles order by user_id limit 2) p;
  select id into no_profile from auth.users where id not in (select user_id from public.backstage_profiles) limit 1;
  if coalesce(array_length(members,1),0) < 2 or no_profile is null then raise exception 'Needs two existing profiles and one account without a profile'; end if;
  perform set_config('test.chat_one',members[1]::text,true);
  perform set_config('test.chat_two',members[2]::text,true);
  perform set_config('test.chat_unregistered',no_profile::text,true);
  perform set_config('test.chat_message',gen_random_uuid()::text,true);
  perform set_config('request.jwt.claim.sub',members[1]::text,true);
end $$;
set local role authenticated;
do $$
declare saved public.backstage_chat_messages; repeated public.backstage_chat_messages; expected_name text;
begin
  select username into expected_name from public.backstage_profiles where user_id=auth.uid();
  select * into saved from public.send_gingahoo_message('Rollback-only chat check',current_setting('test.chat_message')::uuid);
  if saved.user_id <> auth.uid() or saved.user_name <> expected_name then raise exception 'Wrong message author'; end if;
  select * into repeated from public.send_gingahoo_message('Rollback-only chat check',saved.id);
  if repeated.id <> saved.id then raise exception 'Retry duplicated message'; end if;
  if not exists(select 1 from public.backstage_chat_messages where id=saved.id) then raise exception 'Message not readable'; end if;
  begin
    perform public.send_gingahoo_message('Too fast',gen_random_uuid());
    raise exception 'Rate limit failed';
  exception when raise_exception then
    if sqlerrm <> 'Give the room a second. Try again shortly.' then raise; end if;
  end;
  begin
    perform public.send_gingahoo_message(repeat('a',501),gen_random_uuid());
    raise exception 'Length check failed';
  exception when raise_exception then
    if sqlerrm <> 'Messages must be between 1 and 500 characters.' then raise; end if;
  end;
  begin
    perform public.send_gingahoo_message(E' \n\t',gen_random_uuid());
    raise exception 'Blank check failed';
  exception when raise_exception then
    if sqlerrm <> 'Messages must be between 1 and 500 characters.' then raise; end if;
  end;
  begin
    insert into public.backstage_chat_messages(id,user_id,user_name,text) values(gen_random_uuid(),auth.uid(),'someone_else','Impersonation check');
    raise exception 'Direct author spoof was allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.backstage_chat_messages set user_name='someone_else' where id=saved.id;
    raise exception 'Message rewrite was allowed';
  exception when insufficient_privilege then null; end;
  perform set_config('request.jwt.claim.sub',current_setting('test.chat_two'),true);
  if not exists(select 1 from public.backstage_chat_messages where id=saved.id) then raise exception 'Other member cannot read room'; end if;
  if exists(select 1 from public.backstage_profiles where user_id=current_setting('test.chat_one')::uuid) then raise exception 'Private profile leaked'; end if;
  perform set_config('request.jwt.claim.sub',current_setting('test.chat_unregistered'),true);
  if exists(select 1 from public.backstage_chat_messages) then raise exception 'Unregistered member can read'; end if;
  begin
    perform public.send_gingahoo_message('No profile',gen_random_uuid());
    raise exception 'Unregistered member could post';
  exception when raise_exception then
    if sqlerrm <> 'Choose your Gzone username first.' then raise; end if;
  end;
end $$;
set local role anon;
do $$
begin
  begin
    perform 1 from public.backstage_chat_messages;
    raise exception 'Anonymous read was allowed';
  exception when insufficient_privilege then null; end;
  begin
    perform public.send_gingahoo_message('Guest',gen_random_uuid());
    raise exception 'Anonymous post was allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: trusted username, retry safety, rate/length/blank limits, member-only reading, private profiles and guest denial. All test writes rolled back.' as result;
