import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMyProfile, type UserProfile } from '@/lib/userProfile';

export function useMyProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    const { data } = await getMyProfile(userId);
    setProfile(data ?? null);
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!userId) {
        setProfile(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await getMyProfile(userId);
        if (!mounted) return;
        setProfile(data ?? null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      // Refresh when navigating back to the screen (e.g., after editing).
      void load();
      return undefined;
    }, [load])
  );

  const refresh = useCallback(async () => {
    if (!userId) return;
    setIsRefreshing(true);
    try {
      await load();
    } finally {
      setIsRefreshing(false);
    }
  }, [load, userId]);

  return { profile, isLoading, isRefreshing, refresh };
}

