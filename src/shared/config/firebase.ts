import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

<<<<<<< HEAD
const requiredFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

const missingFirebaseKeys = Object.entries(requiredFirebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseKeys.length > 0) {
  throw new Error(
    `Missing Firebase public environment variables: ${missingFirebaseKeys.join(", ")}`,
  );
}

const firebaseConfig = {
  apiKey: requiredFirebaseConfig.apiKey,
  authDomain: requiredFirebaseConfig.authDomain,
  projectId: requiredFirebaseConfig.projectId,
  storageBucket: requiredFirebaseConfig.storageBucket,
  messagingSenderId: requiredFirebaseConfig.messagingSenderId,
  appId: requiredFirebaseConfig.appId,
=======
const getPublicEnv = (key: string): string | undefined => {
  return process.env[key];
};

const firebaseConfig = {
  apiKey: getPublicEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getPublicEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getPublicEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getPublicEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getPublicEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
>>>>>>> da991be (chore: Next.js 전환 구조 정리 및 Vite 제거)
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
