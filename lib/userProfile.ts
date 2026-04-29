import { supabase } from '@/lib/supabase';

export type UserProfile = {
  id: string;
  full_name: string | null;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  interests?: string[] | null;
  linkedin_url: string | null;
  x_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
  updated_at?: string | null;
};

export async function getMyProfile(userId: string) {
  return await supabase
    .from('user_profiles')
    .select(
      'id,full_name,title,bio,avatar_url,interests,linkedin_url,x_url,instagram_url,website_url,updated_at'
    )
    .eq('id', userId)
    .maybeSingle<UserProfile>();
}

export async function upsertMyProfile(profile: Partial<UserProfile> & { id: string }) {
  return await supabase.from('user_profiles').upsert(profile, { onConflict: 'id' });
}

