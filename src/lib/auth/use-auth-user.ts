"use client";

import type { NavUser } from "@/shared/ui/navigation/navigation";
import type { AuthRole, BackendUser } from "@/api/auth";
import { useAuthSession } from "./auth-session";

const roleToUserType = (role: AuthRole): NavUser["userType"] => {
  if (role === "PROFESSOR") return "교수";
  if (role === "COMPANY") return "기업";
  return "학생";
};

const isAdminRole = (adminRole: BackendUser["adminRole"]): boolean =>
  adminRole === "ADMIN" || adminRole === "SUPER_ADMIN";

export const useAuthUser = (): NavUser | null => {
  const { session } = useAuthSession();

  if (!session) return null;

  return {
    name: session.name ?? session.email ?? "사용자",
    email: session.email,
    userType: roleToUserType(session.role),
    isAdmin: isAdminRole(session.adminRole),
  };
};
