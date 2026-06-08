import type { Portfolio } from '../types';

const TOKEN_KEY = 'portfolio_admin_token';

// Empty base => use the Vite dev proxy ("/api"). In production set VITE_API_BASE_URL.
const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function url(path: string): string {
  return `${BASE}${path}`;
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function getPortfolio(): Promise<Portfolio> {
  const res = await fetch(url('/api/portfolio'));
  if (!res.ok) throw new Error(`Failed to load portfolio (${res.status})`);
  return res.json();
}

export async function savePortfolio(data: Portfolio): Promise<Portfolio> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(url('/api/portfolio'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to save (${res.status})`);
  }
  return res.json();
}

export async function changePassword(newPassword: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(url('/api/auth/change-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to change password (${res.status})`);
  }
}
