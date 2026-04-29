-- Supabase Storage policies for avatar uploads
-- 1) Create a bucket named: avatars (public recommended for simple image display)
-- 2) Run this in Supabase SQL Editor
--
-- Suggested upload path from the app: {uid}/avatar.jpg

-- Allow anyone to read avatars (works for public profile images)
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
on storage.objects
for select
using (bucket_id = 'avatars');

-- Allow authenticated users to upload/update/delete only inside their folder: {uid}/...
drop policy if exists "avatars_user_write_own_folder" on storage.objects;
create policy "avatars_user_write_own_folder"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

