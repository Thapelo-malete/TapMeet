import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

type SessionUser = {
  fullName: string;
  email: string;
};

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  ready: boolean;
  user: SessionUser | null;
  supabaseUser: User | null;
  register: (input: RegisterInput) => Promise<{ ok: boolean; message?: string }>;
  login: (input: LoginInput) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSession() {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session ?? null);
      setSupabaseUser(data.session?.user ?? null);
      setUser(
        data.session?.user
          ? {
              email: data.session.user.email ?? '',
              fullName:
                (data.session.user.user_metadata?.fullName as string | undefined) ??
                (data.session.user.user_metadata?.full_name as string | undefined) ??
                (data.session.user.email?.split('@')[0] ?? 'User'),
            }
          : null
      );
      setReady(true);
    }

    loadInitialSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSupabaseUser(nextSession?.user ?? null);
      setUser(
        nextSession?.user
          ? {
              email: nextSession.user.email ?? '',
              fullName:
                (nextSession.user.user_metadata?.fullName as string | undefined) ??
                (nextSession.user.user_metadata?.full_name as string | undefined) ??
                (nextSession.user.email?.split('@')[0] ?? 'User'),
            }
          : null
      );
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      user,
      supabaseUser,
      register: async ({ fullName, email, password, confirmPassword }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = fullName.trim();

        if (!normalizedName || !normalizedEmail || !password) {
          return { ok: false, message: 'Please fill in all fields.' };
        }
        if (!normalizedEmail.includes('@')) {
          return { ok: false, message: 'Please enter a valid email address.' };
        }
        if (password.length < 6) {
          return { ok: false, message: 'Password must be at least 6 characters.' };
        }
        if (password !== confirmPassword) {
          return { ok: false, message: 'Passwords do not match.' };
        }

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: { fullName: normalizedName },
          },
        });

        if (error) {
          return { ok: false, message: error.message };
        }

        // If email confirmation is enabled, there may be no session yet.
        if (!data.session) {
          return { ok: true, message: 'Check your email to confirm your account.' };
        }

        return { ok: true };
      },
      login: async ({ email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          return { ok: false, message: error.message };
        }

        return { ok: true };
      },
      logout: async () => {
        await supabase.auth.signOut();
      },
    }),
    [ready, user, supabaseUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
