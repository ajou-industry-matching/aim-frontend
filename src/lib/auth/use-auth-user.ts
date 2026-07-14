"use client";

import type { NavUser } from "@/shared/ui/navigation/navigation";
import { useAuthSession } from "./auth-session";
import { toNavUser } from "./to-nav-user";

export const useAuthUser = (): NavUser | null => {
  const { session } = useAuthSession();

  return toNavUser(session);
};
