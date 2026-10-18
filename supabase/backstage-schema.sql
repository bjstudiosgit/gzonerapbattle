-- Prepared for review. Apply only after checking the existing Supabase project.
-- New, isolated Backstage tables. No changes to the Firebase voting system.
begin;

create table public.backstage_email_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  opted_in boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.backstage_email_preferences enable row level security;
revoke all on public.backstage_email_preferences from anon, authenticated;
grant select on public.backstage_email_preferences to authenticated;
create policy "Members read their own email preference"
on public.backstage_email_preferences for select to authenticated
using ((select auth.uid()) = user_id);

-- Derive the email from the authenticated account, never from client input.
create function public.set_backstage_email_updates(wants_updates boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare
  member_id uuid := auth.uid();
  member_email text;
begin
  if member_id is null or wants_updates is null then
    raise exception 'A signed-in account and an email preference are required';
  end if;
  select email into member_email from auth.users
    where id = member_id and email_confirmed_at is not null;
  if member_email is null then
    raise exception 'A verified email is required';
  end if;
  insert into public.backstage_email_preferences(user_id,email,opted_in,updated_at)
  values(member_id,member_email,wants_updates,now())
  on conflict(user_id) do update set email=excluded.email,
    opted_in=excluded.opted_in,updated_at=excluded.updated_at;
end;
$$;
revoke all on function public.set_backstage_email_updates(boolean) from public, anon;
grant execute on function public.set_backstage_email_updates(boolean) to authenticated;

create table public.backstage_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  storage_path text not null unique,
  published boolean not null default false,
  published_at timestamptz not null default now()
);
alter table public.backstage_videos enable row level security;
revoke all on public.backstage_videos from anon, authenticated;
grant select on public.backstage_videos to authenticated;
create policy "Members read published videos"
on public.backstage_videos for select to authenticated
using (published = true);

insert into storage.buckets(id,name,public)
values('backstage-videos','backstage-videos',false);
create policy "Members watch published Backstage videos"
on storage.objects for select to authenticated
using (bucket_id='backstage-videos' and exists(
  select 1 from public.backstage_videos v
  where v.storage_path=storage.objects.name and v.published=true
));

commit;
