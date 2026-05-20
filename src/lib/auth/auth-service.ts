"use client";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  fetchGoogleProfile,
  GOOGLE_PROFILE_SCOPES,
  loginWithBackend,
  type BackendLoginRequest,
  type BackendUser,
} from "@/api/auth";
import { auth } from "@/shared/config/firebase";

type SessionResponse = {
  uid: string;
  email: string | null;
  backendUser: BackendUser;
};

const BACKEND_USER_KEY = "aim_backend_user";

export const storeBackendUser = (user: BackendUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(BACKEND_USER_KEY, JSON.stringify(user));
  }
};

export const clearBackendUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(BACKEND_USER_KEY);
  }
};

export const getStoredBackendUser = (): BackendUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(BACKEND_USER_KEY);
    return stored ? (JSON.parse(stored) as BackendUser) : null;
  } catch {
    return null;
  }
};

const googleProvider = new GoogleAuthProvider();
GOOGLE_PROFILE_SCOPES.forEach((scope) => googleProvider.addScope(scope));

const createSession = async (
  idToken: string,
  profile: BackendLoginRequest,
): Promise<SessionResponse> => {
  let backendUser: BackendUser;

  try {
    backendUser = await loginWithBackend(idToken, profile);
  } catch (error) {
    await firebaseSignOut(auth).catch(() => undefined);
    throw error;
  }

  storeBackendUser(backendUser);

  return {
    uid: auth.currentUser?.uid ?? "",
    email: auth.currentUser?.email ?? null,
    backendUser,
  };
};

export const signInWithGoogle = async (): Promise<SessionResponse> => {
  const credential = await signInWithPopup(auth, googleProvider);

  try {
    const googleCredential = GoogleAuthProvider.credentialFromResult(credential);
    const accessToken = googleCredential?.accessToken;

    if (!accessToken) {
      throw new Error("Google access token is missing.");
    }

    const [idToken, profile] = await Promise.all([
      credential.user.getIdToken(),
      fetchGoogleProfile(accessToken),
    ]);

    return await createSession(idToken, profile);
  } catch (error) {
    await firebaseSignOut(auth).catch(() => undefined);
    throw error;
  }
};

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<SessionResponse> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await credential.user.getIdToken();

  return createSession(idToken, {
    role: "COMPANY",
    name: credential.user.displayName ?? credential.user.email ?? email,
    department: "",
  });
};

export const signOut = async (): Promise<void> => {
  clearBackendUser();
  await firebaseSignOut(auth);
};
