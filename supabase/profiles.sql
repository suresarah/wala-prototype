-- Wala prototype · profile collection
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Testers (anonymous, using the public key) can ADD a profile and photos but can't read anything.
-- Only emails listed in team_members can read profiles on team.html after signing in by email link.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null check (role in ('owner', 'helper')),
  first_name text check (char_length(first_name) <= 60),
  zip text check (char_length(zip) <= 10),
  data jsonb not null check (pg_column_size(data) < 60000),
  photos text[] not null default '{}' check (cardinality(photos) <= 8),
  user_agent text
);

create table if not exists public.team_members (email text primary key);

alter table public.profiles enable row level security;
alter table public.team_members enable row level security;

drop policy if exists "testers can add a profile" on public.profiles;
create policy "testers can add a profile" on public.profiles
  for insert to anon, authenticated with check (true);

drop policy if exists "team can read profiles" on public.profiles;
create policy "team can read profiles" on public.profiles
  for select to authenticated
  using (exists (select 1 from public.team_members t where lower(t.email) = lower(auth.jwt() ->> 'email')));

drop policy if exists "team can delete profiles" on public.profiles;
create policy "team can delete profiles" on public.profiles
  for delete to authenticated
  using (exists (select 1 from public.team_members t where lower(t.email) = lower(auth.jwt() ->> 'email')));

-- Photos: private bucket, 5 MB images only
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-photos', 'profile-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "testers can upload profile photos" on storage.objects;
create policy "testers can upload profile photos" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'profile-photos');

drop policy if exists "team can view profile photos" on storage.objects;
create policy "team can view profile photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'profile-photos' and exists (select 1 from public.team_members t where lower(t.email) = lower(auth.jwt() ->> 'email')));

-- Add everyone on the team who should see profiles (one line each):
insert into public.team_members (email) values ('YOUR-EMAIL@example.com') on conflict do nothing;  -- ← put your email here
-- insert into public.team_members (email) values ('teammate@example.com') on conflict do nothing;
