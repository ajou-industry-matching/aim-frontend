/// <reference types="vite/client" />

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const getPublicEnv = (nextKey: string, viteKey: keyof ImportMetaEnv): string | undefined => {
  return process.env[nextKey] ?? import.meta.env[viteKey];
};

const firebaseConfig = {
  apiKey: getPublicEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "VITE_FIREBASE_API_KEY"),
  authDomain: getPublicEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getPublicEnv(
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_STORAGE_BUCKET",
  ),
  messagingSenderId: getPublicEnv(
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
  ),
  appId: getPublicEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "VITE_FIREBASE_APP_ID"),
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
