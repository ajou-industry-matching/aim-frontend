"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/shared/config/firebase";

export type AuthReadyState = {
  isReady: boolean;
  isAuthenticated: boolean;
};

const INITIAL_AUTH_READY_STATE: AuthReadyState = {
  isReady: false,
  isAuthenticated: false,
};

export const useAuthReady = (): AuthReadyState => {
  const [state, setState] = useState<AuthReadyState>(INITIAL_AUTH_READY_STATE);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ isReady: true, isAuthenticated: user !== null });
    });
    return unsubscribe;
  }, []);

  return state;
};
