import React, { createContext, useContext, useState, useCallback } from 'react';
import { getSession, setSession, clearSession, loginUser, registerUser } from '../services/auth';
import type { Session } from '../types';

interface AuthContextValue {
  session: Session | null;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() => getSession());

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const user = await loginUser(email, password);
    if (!user) return 'Invalid email or password.';
    setSession(user);
    setSessionState({ userId: user.id, email: user.email, name: user.name });
    return null;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<string | null> => {
      const user = await registerUser(name, email, password);
      if (!user) return 'An account with that email already exists.';
      setSession(user);
      setSessionState({ userId: user.id, email: user.email, name: user.name });
      return null;
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
