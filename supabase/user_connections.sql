-- User-to-user connections created from QR scans.
-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.user_connections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  other_user_id uuid not null references auth.users(id) on delete cascade,
  met_at timestamptz not null default now(),
  met_lat double precision,
  met_lng double precision,
  met_location text,
  created_at timestamptz not null default now()
);

-- Prevent duplicate connections per owner/other pair.
alter table public.user_connections
  drop constraint if exists user_connections_owner_other_unique;
alter table public.user_connections
  add constraint user_connections_owner_other_unique unique (owner_id, other_user_id);

create index if not exists idx_user_connections_owner_met_at
  on public.user_connections (owner_id, met_at desc);

alter table public.user_connections enable row level security;

drop policy if exists "user_connections_select_own" on public.user_connections;
create policy "user_connections_select_own"
  on public.user_connections
  for select
  using (auth.uid() = owner_id);

drop policy if exists "user_connections_insert_own" on public.user_connections;
create policy "user_connections_insert_own"
  on public.user_connections
  for insert
  with check (auth.uid() = owner_id);

-- RPC to connect two users in one call (creates rows for both users).
-- NOTE: Postgres won't allow renaming input params via CREATE OR REPLACE,
-- so we drop the old signature first (safe/idempotent).
drop function if exists public.connect_users(uuid, double precision, double precision, text);
create or replace function public.connect_users(
  p_other_user_id uuid,
  met_lat double precision default null,
  met_lng double precision default null,
  met_location text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_other_user_id is null then
    raise exception 'Missing other_user_id';
  end if;

  if p_other_user_id = auth.uid() then
    raise exception 'Cannot connect to yourself';
  end if;

  insert into public.user_connections (owner_id, other_user_id, met_lat, met_lng, met_location)
  values (auth.uid(), p_other_user_id, met_lat, met_lng, met_location)
  on conflict (owner_id, other_user_id) do nothing;

  insert into public.user_connections (owner_id, other_user_id, met_lat, met_lng, met_location)
  values (p_other_user_id, auth.uid(), met_lat, met_lng, met_location)
  on conflict (owner_id, other_user_id) do nothing;
end;
$$;

revoke all on function public.connect_users(uuid, double precision, double precision, text) from public;
grant execute on function public.connect_users(uuid, double precision, double precision, text) to authenticated;

