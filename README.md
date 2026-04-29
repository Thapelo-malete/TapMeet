# TapMeet

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-a2u7vk3r)

## Supabase setup

1. Copy `.env.example` to `.env`.
2. Fill in:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Restart Expo after changing env vars.

Use the shared client from `lib/supabase.ts`:

```ts
import { supabase } from '@/lib/supabase';
```

## Create real tables + seed data

1. Open Supabase Dashboard -> SQL Editor.
2. Run `supabase/init.sql`.
3. Run `supabase/user_profiles.sql` (for editable user profiles).
4. Run `supabase/storage_avatars.sql` and create a Storage bucket named `avatars` (set it to public for easiest image display).
5. In project root, copy `.env.example` to `.env` and paste your real anon key.
6. Restart Expo (`npm run dev`).
