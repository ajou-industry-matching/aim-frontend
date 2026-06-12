"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/shared/config/firebase";
import type { NavUser } from "@/shared/ui/navigation/navigation";
import type { AuthRole } from "@/api/auth";
import { getStoredBackendUser } from "./auth-service";

const roleToUserType = (role: AuthRole): NavUser["userType"] => {
  if (role === "PROFESSOR") return "교수";
  if (role === "COMPANY") return "기업";
  return "학생";
};

export const useAuthUser = (): NavUser | null => {
  const [navUser, setNavUser] = useState<NavUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setNavUser(null);
        return;
      }

      const backendUser = getStoredBackendUser();
      setNavUser({
        name: backendUser?.name ?? firebaseUser.displayName ?? firebaseUser.email ?? "사용자",
        email: firebaseUser.email ?? "",
        userType: backendUser ? roleToUserType(backendUser.role) : "학생",
        isAdmin: backendUser?.adminRole !== undefined && backendUser.adminRole !== "NONE",
      });
    });

    return unsubscribe;
  }, []);

  return navUser;
};
