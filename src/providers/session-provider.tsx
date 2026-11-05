import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';

const SESSION_STORAGE_KEY = '@posterbox/session';

export type SessionUser = {
  email: string;
  name: string;
  phone?: string;
};

type SignInOptions = {
  persist?: boolean;
};

type SessionContextValue = {
  session: SessionUser | null;
  isLoading: boolean;
  signIn: (user: { email: string; name?: string }, options?: SignInOptions) => Promise<void>;
  updateProfile: (patch: { name: string; phone: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function displayNameFromEmail(email: string) {
  const local = email.split('@')[0] ?? 'User';
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(SESSION_STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) {
          return;
        }
        const parsed = JSON.parse(raw) as SessionUser;
        if (parsed?.email) {
          setSession(parsed);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(
    async (user: { email: string; name?: string }, options?: SignInOptions) => {
      const next: SessionUser = {
        email: user.email,
        name: user.name?.trim() || displayNameFromEmail(user.email),
      };
      setSession(next);
      if (options?.persist === false) {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
        return;
      }
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
    },
    []
  );

  const updateProfile = useCallback(async (patch: { name: string; phone: string }) => {
    let next: SessionUser | null = null;
    setSession((current) => {
      if (!current) {
        return current;
      }
      next = { ...current, name: patch.name.trim(), phone: patch.phone.trim() };
      return next;
    });
    if (!next) {
      return;
    }
    const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const signOut = useCallback(async () => {
    setSession(null);
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      signIn,
      updateProfile,
      signOut,
    }),
    [session, isLoading, signIn, updateProfile, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
