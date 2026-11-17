import { initializeApp, type FirebaseApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore/lite';
import type { PortfolioData } from '../types';
import { defaultData } from './defaults';

/** Public web config (same project the admin dashboard writes to). */
const firebaseConfig = {
  apiKey: 'AIzaSyBBbmATSJ6cWQrauTycpFVbVXOW_ZJiNbY',
  authDomain: 'kittiphat-protfolio-3882c.firebaseapp.com',
  projectId: 'kittiphat-protfolio-3882c',
  storageBucket: 'kittiphat-protfolio-3882c.firebasestorage.app',
  messagingSenderId: '295019642338',
  appId: '1:295019642338:web:3a2ade99f7ba649d150dbb',
} as const;

/** Keys shared with the legacy admin panel (data-manager.js) — do not rename. */
const KEYS = {
  DATA: 'vantage_portfolio_data',
  VERSION: 'vantage_portfolio_version',
} as const;
const CACHE_VERSION = '2.0';
const FETCH_TIMEOUT_MS = 5000;

let app: FirebaseApp | null = null;

function safeStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function isPortfolioData(value: unknown): value is PortfolioData {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (!v.about || typeof v.about !== 'object') return false;
  if (!Array.isArray(v.skills) || !Array.isArray(v.projects)) return false;
  if (v.certificates !== undefined && !Array.isArray(v.certificates)) return false;
  return true;
}

/** Refresh the old vocational-student biography without discarding saved work. */
export function refreshLegacyProfile(data: PortfolioData): PortfolioData {
  if (typeof data.about.description !== 'string' || (!data.about.description.includes('นักศึกษาปวส.2') && !data.about.description.includes('ชั้นปีที่ 3 มหาวิทยาลัยศรีปทุม ผมสนใจการพัฒนาเว็บไซต์'))) return data;
  const education = (data.about.education ?? []).map((e) => e.institution.includes('ศรีปทุม') && e.degree === 'ระดับปริญญาตรี · ชั้นปีที่ 3' ? defaultData.about.education![0]! : e);
  return { ...data, about: { ...data.about,
    description: defaultData.about.description,
    detail: defaultData.about.detail,
    philosophy: defaultData.about.philosophy,
    education: education.some((e) => e.institution.includes('ศรีปทุม')) ? education : [defaultData.about.education![0]!, ...education],
  } };
}

/** Synchronous best-effort data: local cache if valid, otherwise bundled defaults. */
export function loadCached(): PortfolioData {
  const storage = safeStorage();
  if (!storage) return defaultData;
  try {
    if (storage.getItem(KEYS.VERSION) !== CACHE_VERSION) {
      storage.removeItem(KEYS.DATA);
      storage.setItem(KEYS.VERSION, CACHE_VERSION);
      return defaultData;
    }
    const raw = storage.getItem(KEYS.DATA);
    if (!raw) return defaultData;
    const parsed: unknown = JSON.parse(raw);
    return isPortfolioData(parsed) ? refreshLegacyProfile(parsed) : defaultData;
  } catch {
    return defaultData;
  }
}

function saveCache(data: PortfolioData): void {
  try {
    safeStorage()?.setItem(KEYS.DATA, JSON.stringify(data));
  } catch {
    /* quota / private mode — ignore */
  }
}

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));
}

/** Latest data from Firestore (`portfolio/main`). Resolves null on failure so callers keep cached data. */
export async function fetchRemote(): Promise<PortfolioData | null> {
  try {
    app ??= initializeApp(firebaseConfig);
    const snap = await Promise.race([getDoc(doc(getFirestore(app), 'portfolio', 'main')), timeout(FETCH_TIMEOUT_MS)]);
    if (!snap.exists()) return null;
    const data: unknown = snap.data();
    if (!isPortfolioData(data)) return null;
    const fresh = refreshLegacyProfile(data);
    saveCache(fresh);
    return fresh;
  } catch (error) {
    console.warn('[portfolio] Firestore unavailable, using cached data.', error);
    return null;
  }
}
