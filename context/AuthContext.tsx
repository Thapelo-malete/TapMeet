import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type StoredUser = {
  fullName: string;
  email: string;
  password: string;
};

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
  user: SessionUser | null;
  register: (input: RegisterInput) => { ok: boolean; message?: string };
  login: (input: LoginInput) => { ok: boolean; message?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [user, setUser] = useState<SessionUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      register: ({ fullName, email, password, confirmPassword }) => {
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
        if (users.some((u) => u.email === normalizedEmail)) {
          return { ok: false, message: 'An account with this email already exists.' };
        }

        const createdUser: StoredUser = {
          fullName: normalizedName,
          email: normalizedEmail,
          password,
        };

        setUsers((prev) => [...prev, createdUser]);
        setUser({ fullName: createdUser.fullName, email: createdUser.email });
        return { ok: true };
      },
      login: ({ email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const matched = users.find(
          (u) => u.email === normalizedEmail && u.password === password
        );

        if (!matched) {
          return { ok: false, message: 'Invalid email or password.' };
        }

        setUser({ fullName: matched.fullName, email: matched.email });
        return { ok: true };
      },
      logout: () => setUser(null),
    }),
    [user, users]
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
