import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, type AuthUser } from '../api/client';

type RegisteredUser = {
  name: string;
  email: string;
  phone: string;
  company: string;
  taxNumber: string;
  password: string;
};

type PublicUser = Omit<RegisteredUser, 'password'> & {
  id?: number;
  role: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = RegisteredUser;

type AuthResult = {
  ok: boolean;
  message?: string;
  user?: PublicUser;
};

type AuthContextValue = {
  user: PublicUser | null;
  register: (data: RegisterInput) => Promise<AuthResult>;
  login: (data: LoginInput) => Promise<AuthResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const CURRENT_USER_KEY = 'pawsentials-current-user';

function toPublicUser(apiUser: AuthUser, extra?: Partial<PublicUser>): PublicUser {
  return {
    id: apiUser.id,
    name: extra?.name || apiUser.email,
    email: apiUser.email,
    phone: extra?.phone || '',
    company: extra?.company || '',
    taxNumber: extra?.taxNumber || '',
    role: String(apiUser.role || '').toLowerCase(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(() => {
    if (typeof window === 'undefined') return null;

    try {
      return JSON.parse(window.localStorage.getItem(CURRENT_USER_KEY) || 'null') as PublicUser | null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,

    register: async (data) => {
      try {
        const apiUser = await api.register(data.email.trim().toLowerCase(), data.password);

        const publicUser = toPublicUser(apiUser, {
          name: data.name,
          phone: data.phone,
          company: data.company,
          taxNumber: data.taxNumber,
        });

        setUser(publicUser);

        return { ok: true, user: publicUser };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : 'Unable to register.',
        };
      }
    },

    login: async ({ email, password }) => {
      try {
        const apiUser = await api.login(email.trim().toLowerCase(), password);
        const publicUser = toPublicUser(apiUser);

        setUser(publicUser);

        return { ok: true, user: publicUser };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : 'Invalid credentials.',
        };
      }
    },

    logout: () => setUser(null),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}