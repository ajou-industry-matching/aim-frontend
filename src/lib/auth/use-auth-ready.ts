"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/shared/config/firebase";

export type AuthReadyState = {
  isReady: boolean;
  isAuthenticated: boolean;
};

const getInitialAuthReadyState = (): AuthReadyState => ({
  isReady: auth.currentUser !== null,
  isAuthenticated: auth.currentUser !== null,
});

export const useAuthReady = (): AuthReadyState => {
  const [state, setState] = useState<AuthReadyState>(getInitialAuthReadyState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ isReady: true, isAuthenticated: user !== null });
    });
    return unsubscribe;
  }, []);

  return state;
};
