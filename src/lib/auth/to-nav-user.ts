"use client";

import type { NavUser } from "@/shared/ui";
import { authRoleLabels } from "./auth-role-labels";
import type { StoredSession } from "./auth-session";

const isAdminRole = (adminRole: StoredSession["adminRole"]): boolean =>
  adminRole === "ADMIN" || adminRole === "SUPER_ADMIN";

export const toNavUser = (session: StoredSession | null | undefined): NavUser | null => {
  if (!session) return null;

  return {
    name: session.name ?? session.email ?? "사용자",
    email: session.email,
    userType: authRoleLabels[session.role],
    isAdmin: isAdminRole(session.adminRole),
  };
};
