import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';

export type ConnectedUser = {
  id: string;
  full_name: string | null;
  title: string | null;
  avatar_url: string | null;
  interests: string[] | null;
  updated_at: string | null;
};

export type UserConnectionItem = {
  otherUserId: string;
  name: string;
  title: string;
  avatarUrl: string | null;
  category: string;
  metAt: string;
  metLocation: string | null;
};

function timeAgoFromIso(iso: string) {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 14) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function useUserConnections(userId?: string, limit = 50) {
  const [items, setItems] = useState<UserConnectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_connections')
      .select('other_user_id,met_at,met_location')
      .eq('owner_id', userId)
      .order('met_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      setItems([]);
      return;
    }

    const rows = data as Array<{
      other_user_id: string;
      met_at: string;
      met_location: string | null;
    }>;

    const otherIds = Array.from(new Set(rows.map((r) => String(r.other_user_id))));
    const { data: profiles } = otherIds.length
      ? await supabase
          .from('user_profiles')
          .select('id,full_name,title,avatar_url,interests,updated_at')
          .in('id', otherIds)
      : { data: [] as any[] };

    const byId = new Map<string, ConnectedUser>();
    for (const p of (profiles ?? []) as any[]) {
      byId.set(String(p.id), p as ConnectedUser);
    }

    const mapped = rows.map((row) => {
      const other = byId.get(String(row.other_user_id)) ?? null;
      const name = (other?.full_name || 'TapMeet user').trim();
      const title = (other?.title || 'TapMeet member').trim();
      const category =
        (other?.interests && other.interests.length ? other.interests[0] : null) ?? 'General';

      return {
        otherUserId: String(row.other_user_id),
        name,
        title,
        avatarUrl: other?.avatar_url ?? null,
        category,
        metAt: row.met_at,
        metLocation: row.met_location ?? null,
      } satisfies UserConnectionItem;
    });

    setItems(mapped);
  }, [limit, userId]);

  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        await load();
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [load, userId]);

  useFocusEffect(
    useCallback(() => {
      void load();
      return undefined;
    }, [load])
  );

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await load();
    } finally {
      setIsRefreshing(false);
    }
  }, [load]);

  return { items, isLoading, isRefreshing, refresh, timeAgoFromIso };
}

