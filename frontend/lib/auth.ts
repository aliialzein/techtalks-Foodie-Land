"use client";

import { useSyncExternalStore } from "react";

// Minimal client-side session handling. The backend returns `{ token, user }`
// from /api/auth/login and /api/auth/register; we persist it in localStorage so
// the rest of the app (e.g. the Orders page) knows who the current user is.

const SESSION_KEY = "foodieland-session";
// Fired on same-tab session changes (the native `storage` event only fires in
// *other* tabs), so `useCurrentUser` subscribers update immediately after login.
const SESSION_EVENT = "foodieland-session-change";

export type UserRole = "CUSTOMER" | "OWNER" | "ADMIN";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

export interface Session {
  token: string;
  user: SessionUser;
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  // Only the JWT goes in the cookie now — middleware verifies its
  // signature instead of trusting a client-editable role field.
  document.cookie =
    `foodieland-token=${session.token}; path=/; max-age=604800; SameSite=Lax`;

  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function getCurrentUser(): SessionUser | null {
  return getSession()?.user ?? null;
}

function readUser(raw: string | null): SessionUser | null {
  if (!raw) return null;
  try {
    return (JSON.parse(raw) as Session).user ?? null;
  } catch {
    return null;
  }
}

// Cache the parsed user so `getSnapshot` returns a *stable* reference between
// renders (required by useSyncExternalStore — a new object every call would loop).
let cachedRaw: string | null = null;
let cachedUser: SessionUser | null = null;

function getSnapshot(): SessionUser | null {
  const raw = typeof window === "undefined" ? null : localStorage.getItem(SESSION_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedUser = readUser(raw);
  }
  return cachedUser;
}

function getServerSnapshot(): SessionUser | null {
  return null;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(SESSION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SESSION_EVENT, onChange);
  };
}

export function useCurrentUser(): SessionUser | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function hasRole(...roles: UserRole[]): boolean {
  const role = getCurrentUser()?.role;
  return role ? roles.includes(role) : false;
}

export function logout(): void {
  clearSession();

  if (typeof document !== "undefined") {
    document.cookie =
      "foodieland-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}