-- TapMeet base schema + seed data
-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null,
  avatar_initials text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  role text not null,
  company text not null,
  category text not null default 'General',
  time_ago text not null default 'Just now',
  initials text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_connections_created_at
  on public.connections (created_at desc);

alter table public.profiles enable row level security;
alter table public.connections enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles
  for select
  using (true);

drop policy if exists "connections_select_all" on public.connections;
create policy "connections_select_all"
  on public.connections
  for select
  using (true);

drop policy if exists "connections_insert_all" on public.connections;
create policy "connections_insert_all"
  on public.connections
  for insert
  with check (true);

insert into public.profiles (full_name, title, avatar_initials)
values
  ('Sam', 'Founder @ TapMeet', 'SA'),
  ('Sarah Jenkins', 'Product Lead @ TechFlow', 'SJ')
on conflict do nothing;

insert into public.connections (name, role, company, category, time_ago, initials, created_at)
values
  ('David Chen', 'Product Designer', 'Vercel', 'Design', '2h ago', 'DC', now() - interval '2 hour'),
  ('Sarah Jenkins', 'Founder', 'EcoStart', 'Startup', 'Yesterday', 'SJ', now() - interval '1 day'),
  ('Marcus Adebayo', 'VP Engineering', 'Stripe', 'Fintech', 'Oct 12', 'MA', now() - interval '4 day'),
  ('Elena Rossi', 'Community Lead', 'Meetly', 'Social', '3d ago', 'ER', now() - interval '3 day'),
  ('Tom Grant', 'Founder', 'Nexify', 'Tech', '5d ago', 'TG', now() - interval '5 day')
on conflict do nothing;
