-- Fresh Gingahoo room. Uses existing Backstage profiles; no Google identity is exposed.
begin;

create table public.backstage_chat_messages (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  text text not null check (char_length(btrim(text)) between 1 and 500 and text ~ '[^[:space:]]'),
  created_at timestamptz not null default now()
);
create index backstage_chat_recent on public.backstage_chat_messages (created_at desc, id desc);
create index backstage_chat_author on public.backstage_chat_messages (user_id, created_at desc);
alter table public.backstage_chat_messages enable row level security;
revoke all on public.backstage_chat_messages from public, anon, authenticated;
grant select on public.backstage_chat_messages to authenticated;
grant all on public.backstage_chat_messages to service_role;

create policy "Members with usernames read Gingahoo"
on public.backstage_chat_messages for select to authenticated
using (exists (select 1 from public.backstage_profiles where user_id = (select auth.uid())));

-- Authors, usernames and timestamps are always assigned by the database.
-- A client-generated request ID makes retries safe without duplicate messages.
create function public.send_gingahoo_message(message_text text, message_id uuid)
returns public.backstage_chat_messages
language plpgsql security definer set search_path = ''
as $$
declare
  member_id uuid := auth.uid();
  member_name text;
  saved public.backstage_chat_messages;
begin
  if member_id is null then raise exception 'Sign in to join Gingahoo.'; end if;
  select username into member_name from public.backstage_profiles where user_id = member_id;
  if member_name is null then raise exception 'Choose your Gzone username first.'; end if;
  if message_id is null or message_text is null or char_length(btrim(message_text)) not between 1 and 500 or message_text !~ '[^[:space:]]' then
    raise exception 'Messages must be between 1 and 500 characters.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(member_id::text, 0));
  select * into saved from public.backstage_chat_messages where id = message_id and user_id = member_id;
  if found then return saved; end if;
  if exists (select 1 from public.backstage_chat_messages where user_id = member_id and created_at > clock_timestamp() - interval '3 seconds') then
    raise exception 'Give the room a second. Try again shortly.';
  end if;
  insert into public.backstage_chat_messages (id, user_id, user_name, text)
    values (message_id, member_id, member_name, btrim(message_text)) returning * into saved;
  return saved;
end;
$$;
revoke all on function public.send_gingahoo_message(text, uuid) from public, anon;
grant execute on function public.send_gingahoo_message(text, uuid) to authenticated;

alter publication supabase_realtime add table public.backstage_chat_messages;
commit;
