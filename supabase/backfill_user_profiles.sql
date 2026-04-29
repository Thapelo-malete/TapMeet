-- Fix missing public.user_profiles rows for existing auth users,
-- and ensure the signup trigger exists.

-- 1) Recreate function + trigger (idempotent)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'fullName', new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 2) Backfill for users that already exist
insert into public.user_profiles (id, full_name)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'fullName', u.raw_user_meta_data->>'full_name', '')
from auth.users u
left join public.user_profiles p on p.id = u.id
where p.id is null;

