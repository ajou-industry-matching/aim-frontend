"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { BackendUser } from "@/api/auth";
import { auth } from "@/shared/config/firebase";

export type AuthSession = {
  uid: string;
  email: string | null;
  backendUser: BackendUser;
};

const AUTH_SESSION_STORAGE_KEY = "aim-auth-session";
const AUTH_SESSION_EVENT = "aim-auth-session-changed";

const authRoles: ReadonlySet<BackendUser["role"]> = new Set(["STUDENT", "PROFESSOR", "COMPANY"]);
const authStatuses: ReadonlySet<BackendUser["status"]> = new Set([
  "ACTIVE",
  "BLOCKED",
  "SUSPENDED",
  "PENDING",
]);
const adminRoles: ReadonlySet<BackendUser["adminRole"]> = new Set(["NONE", "ADMIN", "SUPER_ADMIN"]);

const normalizeBackendUser = (value: unknown): BackendUser | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const user = value as Partial<BackendUser>;
  const department = typeof user.department === "string" ? user.department : "";

  if (
    typeof user.userId === "number" &&
    typeof user.name === "string" &&
    authRoles.has(user.role as BackendUser["role"]) &&
    authStatuses.has(user.status as BackendUser["status"]) &&
    adminRoles.has(user.adminRole as BackendUser["adminRole"])
  ) {
    return {
      userId: user.userId,
      role: user.role as BackendUser["role"],
      status: user.status as BackendUser["status"],
      adminRole: user.adminRole as BackendUser["adminRole"],
      name: user.name,
      department,
    };
  }

  return null;
};

const normalizeAuthSession = (value: unknown): AuthSession | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const session = value as Partial<AuthSession>;
  const backendUser = normalizeBackendUser(session.backendUser);

  if (
    typeof session.uid === "string" &&
    (typeof session.email === "string" || session.email === null) &&
    backendUser
  ) {
    return {
      uid: session.uid,
      email: session.email,
      backendUser,
    };
  }

  return null;
};

const emitAuthSessionChanged = () => {
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
};

const readStoredAuthSession = (): AuthSession | null => {
  const storedValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    return normalizeAuthSession(parsedValue);
  } catch {
    return null;
  }
};

const normalizeSessionForStorage = (session: AuthSession): AuthSession => ({
  ...session,
  backendUser: {
    ...session.backendUser,
    department: session.backendUser.department ?? "",
  },
});

const removeStoredAuthSession = (shouldNotify = true) => {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);

  if (shouldNotify) {
    emitAuthSessionChanged();
  }
};

export const saveAuthSession = (session: AuthSession): void => {
  window.localStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify(normalizeSessionForStorage(session)),
  );
  emitAuthSessionChanged();
};

export const clearAuthSession = (): void => {
  removeStoredAuthSession();
};

const getSessionForFirebaseUser = (firebaseUser: User): AuthSession | null => {
  const storedSession = readStoredAuthSession();

  if (!storedSession || storedSession.uid !== firebaseUser.uid) {
    return null;
  }

  return {
    ...storedSession,
    email: storedSession.email ?? firebaseUser.email,
  };
};

export const useAuthSession = (): {
  session: AuthSession | null;
  isAuthReady: boolean;
} => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const syncSession = (firebaseUser: User | null = auth.currentUser) => {
      if (!firebaseUser) {
        removeStoredAuthSession(false);
        setSession(null);
        setIsAuthReady(true);
        return;
      }

      setSession(getSessionForFirebaseUser(firebaseUser));
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
