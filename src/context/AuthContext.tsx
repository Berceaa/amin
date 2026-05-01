import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { normalizeSpaces } from '../utils/validation';

type RegisteredUser = {
  name: string;
  email: string;
  phone: string;
  company: string;
  taxNumber: string;
  password: string;
};

type PublicUser = Omit<RegisteredUser, 'password'>;

type LoginInput = {
  name: string;
  password: string;
};

type RegisterInput = RegisteredUser;

type AuthContextValue = {
  user: PublicUser | null;
  register: (data: RegisterInput) => { ok: boolean; message?: string };
  login: (data: LoginInput) => { ok: boolean; message?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = 'pawsentials-users';
const CURRENT_USER_KEY = 'pawsentials-current-user';

function readUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]') as RegisteredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: RegisteredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function sanitize(user: RegisteredUser): PublicUser {
  const { password: _password, ...rest } = user;
  return rest;
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
    register: (data) => {
      const users = readUsers();
      const normalizedData = {
        ...data,
        name: normalizeSpaces(data.name),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        company: normalizeSpaces(data.company),
        taxNumber: normalizeSpaces(data.taxNumber),
      };

      const exists = users.some(
        (item) => item.email.toLowerCase() === normalizedData.email || item.name.toLowerCase() === normalizedData.name.toLowerCase(),
      );

      if (exists) {
        return { ok: false, message: 'User already exists.' };
      }

      users.push(normalizedData);
      writeUsers(users);
      setUser(sanitize(normalizedData));
      return { ok: true };
    },
    login: ({ name, password }) => {
      const normalizedName = normalizeSpaces(name).toLowerCase();
      const found = readUsers().find(
        (item) => item.name.toLowerCase() === normalizedName && item.password === password,
      );

      if (!found) {
        return { ok: false, message: 'Invalid credentials.' };
      }

      setUser(sanitize(found));
      return { ok: true };
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
