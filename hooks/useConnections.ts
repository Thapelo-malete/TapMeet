import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface ConnectionItem {
  id: string;
  name: string;
  role: string;
  company: string;
  category: string;
  timeAgo: string;
  initials: string;
}

interface ConnectionRow {
  id: string | number;
  name: string | null;
  role: string | null;
  company: string | null;
  category: string | null;
  time_ago: string | null;
  initials: string | null;
}

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

export function useConnections(limit = 20) {
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConnections() {
      const { data, error } = await supabase
        .from('connections')
        .select('id,name,role,company,category,time_ago,initials')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!isMounted) return;

      if (error || !data) {
        setError('Failed to load connections.');
        setConnections([]);
        setIsLoading(false);
        return;
      }

      setConnections(data.map((row) => mapRow(row as ConnectionRow)));
      setIsLoading(false);
    }

    loadConnections();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { connections, isLoading, error };
}
