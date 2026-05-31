"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
  updateProfile,
} from "firebase/auth";
import {
  fetchGoogleProfile,
  GOOGLE_PROFILE_SCOPES,
  loginWithBackend,
  type BackendLoginRequest,
  type BackendUser,
} from "@/api/auth";
import { auth } from "@/shared/config/firebase";
import { clearAuthSession, saveAuthSession } from "./auth-session";

type SessionResponse = {
  uid: string;
  email: string | null;
  backendUser: BackendUser;
};

type CompanySignupProfile = {
  companyName: string;
  name: string;
};

const googleProvider = new GoogleAuthProvider();
GOOGLE_PROFILE_SCOPES.forEach((scope) => googleProvider.addScope(scope));

const createSession = async (
  firebaseUser: User,
  idToken: string,
  profile: BackendLoginRequest,
): Promise<SessionResponse> => {
  let backendUser: BackendUser;

  try {
    backendUser = await loginWithBackend(idToken, profile);
  } catch (error) {
    await firebaseSignOut(auth).catch(() => undefined);
    clearAuthSession();
    throw error;
  }

  const session = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    backendUser,
  };

  saveAuthSession(session);

  return session;
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

    return await createSession(credential.user, idToken, profile);
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

  return createSession(credential.user, idToken, {
    role: "COMPANY",
    name: credential.user.displayName ?? credential.user.email ?? email,
    department: "",
  });
};

export const signUpCompanyWithEmail = async (
  email: string,
  password: string,
  profile: CompanySignupProfile,
): Promise<SessionResponse> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(credential.user, {
    displayName: profile.name,
  });

  const idToken = await credential.user.getIdToken();

  return createSession(credential.user, idToken, {
    role: "COMPANY",
    name: profile.name,
    department: profile.companyName,
  });
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } finally {
    clearAuthSession();
  }
};
