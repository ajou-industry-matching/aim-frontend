"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { BackendUser } from "@/api/auth";
import { auth } from "@/shared/config/firebase";

export type AuthSession = {
  uid: string;
  email: string | null;
  displayName: string | null;
  backendUser: BackendUser;
};

export type StoredSession = {
  uid: string;
  email: string | null;
  name: string | null;
  role: BackendUser["role"];
  adminRole: BackendUser["adminRole"];
};

const AUTH_SESSION_STORAGE_KEY = "aim-auth-session";
const AUTH_SESSION_EVENT = "aim-auth-session-changed";

const authRoles: ReadonlySet<BackendUser["role"]> = new Set(["STUDENT", "PROFESSOR", "COMPANY"]);
const adminRoles: ReadonlySet<BackendUser["adminRole"]> = new Set(["NONE", "ADMIN", "SUPER_ADMIN"]);

// 빈 문자열/공백 이름은 "없음"으로 취급해 이메일 fallback이 정상 동작하도록 정규화한다.
// localStorage에서 온 unknown 값도 안전하게 처리한다(문자열이 아니면 null).
const toDisplayName = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed ? trimmed : null;
};

const normalizeStoredSession = (value: unknown): StoredSession | null => {
  if (!value || typeof value !== "object") return null;

  const s = value as Partial<StoredSession>;

  if (
    typeof s.uid === "string" &&
    authRoles.has(s.role as BackendUser["role"]) &&
    (typeof s.email === "string" || s.email === null)
  ) {
    return {
      uid: s.uid,
      email: s.email,
      name: toDisplayName(s.name),
      role: s.role as BackendUser["role"],
      adminRole: adminRoles.has(s.adminRole as BackendUser["adminRole"])
        ? (s.adminRole as BackendUser["adminRole"])
        : "NONE",
    };
  }

  return null;
};

const emitAuthSessionChanged = () => {
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
};

const readStoredSession = (): StoredSession | null => {
  const storedValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!storedValue) return null;

  try {
    return normalizeStoredSession(JSON.parse(storedValue));
  } catch {
    return null;
  }
};

const removeStoredAuthSession = (shouldNotify = true) => {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);

  if (shouldNotify) {
    emitAuthSessionChanged();
  }
};

export const saveAuthSession = (session: AuthSession): void => {
  const toStore: StoredSession = {
    uid: session.uid,
    email: session.email,
    name: toDisplayName(session.backendUser.name) ?? toDisplayName(session.displayName),
    role: session.backendUser.role,
    adminRole: session.backendUser.adminRole ?? "NONE",
  };

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(toStore));
  emitAuthSessionChanged();
};

export const clearAuthSession = (): void => {
  removeStoredAuthSession();
};

const getStoredSessionForUser = (firebaseUser: User): StoredSession | null => {
  const stored = readStoredSession();

  if (!stored || stored.uid !== firebaseUser.uid) return null;

  return {
    ...stored,
    email: stored.email ?? firebaseUser.email,
    name: stored.name ?? toDisplayName(firebaseUser.displayName),
  };
};

export const useAuthSession = (): {
  session: StoredSession | null;
  isAuthReady: boolean;
} => {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const syncSession = (firebaseUser: User | null = auth.currentUser) => {
      if (!firebaseUser) {
        removeStoredAuthSession(false);
        setSession(null);
        setIsAuthReady(true);
        return;
      }

      setSession(getStoredSessionForUser(firebaseUser));
      setIsAuthReady(true);
    };

    const unsubscribeAuth = onAuthStateChanged(auth, syncSession);

    const handleSessionChanged = () => {
      syncSession();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_SESSION_STORAGE_KEY) {
        syncSession();
      }
    };

    window.addEventListener(AUTH_SESSION_EVENT, handleSessionChanged);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribeAuth();
      window.removeEventListener(AUTH_SESSION_EVENT, handleSessionChanged);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { session, isAuthReady };
};
