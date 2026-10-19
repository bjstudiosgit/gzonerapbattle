-- Add to the existing Backstage Supabase project once.
-- Google identity data stays in Auth; only a chosen username is stored here.
begin;

create table public.backstage_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  constraint backstage_username_format check (username ~ '^[a-z0-9][a-z0-9_]{2,23}$')
);
alter table public.backstage_profiles enable row level security;
revoke all on public.backstage_profiles from public, anon, authenticated;
grant select on public.backstage_profiles to authenticated;
grant insert (user_id, username), update (user_id, username) on public.backstage_profiles to authenticated;
grant all on public.backstage_profiles to service_role;

create policy "Members read their own profile"
on public.backstage_profiles for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Members create their own profile"
on public.backstage_profiles for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Members update their own username"
on public.backstage_profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

commit;
