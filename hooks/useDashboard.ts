import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import type { UserConnectionItem } from '@/hooks/useUserConnections';

export function useDashboard(userId?: string) {
  const [recentConnections, setRecentConnections] = useState<UserConnectionItem[]>([]);
  const [connectionsCount, setConnectionsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setRecentConnections([]);
      setConnectionsCount(0);
      return;
    }
    const [{ data: list, error: listError }, { count, error: countError }] = await Promise.all([
      supabase
        .from('user_connections')
        .select('other_user_id,met_at,met_location')
        .eq('owner_id', userId)
        .order('met_at', { ascending: false })
        .limit(8),
      supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId),
    ]);

    if (listError || countError) {
      setRecentConnections([]);
      setConnectionsCount(0);
      return;
    }

    const rows = (list ?? []) as Array<{
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

    const byId = new Map<string, any>();
    for (const p of profiles ?? []) byId.set(String((p as any).id), p);

    const mapped = rows.map((row) => {
      const other = byId.get(String(row.other_user_id));
      const name = (other?.full_name || 'TapMeet user').trim();
      const title = (other?.title || 'TapMeet member').trim();
      const category =
        (Array.isArray(other?.interests) && other.interests.length ? other.interests[0] : null) ??
        'General';

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

    setRecentConnections(mapped);
    setConnectionsCount(count ?? 0);
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    async function init() {
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
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      // keep home/dashboard numbers fresh when coming back
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

  return { recentConnections, connectionsCount, isLoading, isRefreshing, refresh };
}

