import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import type { ConnectionItem } from '@/hooks/useConnections';

type ConnectionRow = {
  id: string;
  name: string | null;
  role: string | null;
  company: string | null;
  category: string | null;
  time_ago: string | null;
  initials: string | null;
};

function toInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
}

function mapRow(row: ConnectionRow): ConnectionItem {
  const safeName = row.name?.trim() || 'Unknown Person';
  return {
    id: String(row.id),
    name: safeName,
    role: row.role?.trim() || 'Professional',
    company: row.company?.trim() || 'TapMeet',
    category: row.category?.trim() || 'General',
    timeAgo: row.time_ago?.trim() || 'Just now',
    initials: row.initials?.trim() || toInitials(safeName) || 'NA',
  };
}

export function useDashboard() {
  const [recentConnections, setRecentConnections] = useState<ConnectionItem[]>([]);
  const [connectionsCount, setConnectionsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [{ data: list, error: listError }, { count, error: countError }] = await Promise.all([
      supabase
        .from('connections')
        .select('id,name,role,company,category,time_ago,initials')
        .order('created_at', { ascending: false })
        .limit(8),
      supabase.from('connections').select('*', { count: 'exact', head: true }),
    ]);

    if (listError || countError) {
      setRecentConnections([]);
      setConnectionsCount(0);
      return;
    }

    setRecentConnections((list ?? []).map((r) => mapRow(r as ConnectionRow)));
    setConnectionsCount(count ?? 0);
  }, []);

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

