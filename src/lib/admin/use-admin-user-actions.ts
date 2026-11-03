"use client";

import { useState } from "react";
import {
  approveCompany,
  grantAdmin,
  grantSuperAdmin,
  revokeAdmin,
  revokeSuperAdmin,
  type AdminRole,
  type AdminUser,
  type AdminUserChange,
} from "@/api/admin";
import { saveSelectedAdminUser } from "./selected-admin-user";

const requestAdminRoleChange = (user: AdminUser, next: AdminRole): Promise<AdminUserChange> => {
  if (next === "ADMIN") return grantAdmin(user.userId);
  if (next === "SUPER_ADMIN") return grantSuperAdmin(user.userId);
  return user.adminRole === "SUPER_ADMIN"
    ? revokeSuperAdmin(user.userId)
    : revokeAdmin(user.userId);
};

export type UseAdminUserActionsResult = {
  user: AdminUser;
  isSubmitting: boolean;
  error: string | null;
  changeAdminRole: (next: AdminRole) => Promise<boolean>;
  approve: () => Promise<boolean>;
};

export const useAdminUserActions = (initialUser: AdminUser): UseAdminUserActionsResult => {
  const [user, setUser] = useState(initialUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (request: () => Promise<AdminUserChange>, message: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const change = await request();
      // 응답에는 이름·이메일 등이 비어 있으므로 바뀐 값만 반영한다.
      const updated = { ...user, adminRole: change.adminRole, status: change.status };
      setUser(updated);
      saveSelectedAdminUser(updated);
      return true;
    } catch (cause) {
      console.error(`[admin] ${message}`, cause);
      setError(`${message}. 잠시 후 다시 시도해주세요.`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    isSubmitting,
    error,
    changeAdminRole: (next) =>
      run(() => requestAdminRoleChange(user, next), "권한을 변경하지 못했습니다"),
    approve: () => run(() => approveCompany(user.userId), "기업 회원을 승인하지 못했습니다"),
  };
};
