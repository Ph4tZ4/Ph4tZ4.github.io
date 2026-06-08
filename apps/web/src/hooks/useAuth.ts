import { useEffect, useState, useCallback } from 'react';

const TOKEN_KEY = 'portfolio_admin_token';
const USER_KEY = 'portfolio_admin_user';

interface AuthUser {
  id: string;
  username: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: getStoredUser(),
    loading: true,
  });

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setState({ user: null, loading: false });
      return;
    }
    // Validate token with backend on mount
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then((data: AuthUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(data));
        setState({ user: data, loading: false });
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState({ user: null, loading: false });
      });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? 'Login failed');
    }
    const { token } = await res.json();
    localStorage.setItem(TOKEN_KEY, token);
    // Decode payload to get user info without extra request
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user: AuthUser = { id: payload.sub, username: payload.username };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ user, loading: false });
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ user: null, loading: false });
  }, []);

  const getToken = useCallback(async (): Promise<string> => {
    const token = getStoredToken();
    if (!token) throw new Error('Not authenticated');
    return token;
  }, []);

  return { ...state, login, logout, getToken };
}
