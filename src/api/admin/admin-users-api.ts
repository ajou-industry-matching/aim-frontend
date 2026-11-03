import type { AuthRole } from "@/api/auth";
import { backendJson } from "@/api/client";

export type AdminRole = "NONE" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED" | "PENDING";

// GET /api/admin/users 의 UserResponse
export type AdminUser = {
  userId: number;
  email: string;
  name: string;
  department: string | null;
  role: AuthRole;
  adminRole: AdminRole;
  status: UserStatus;
  createdAt: string;
};

export type AdminUserPage = {
  content: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type GetAdminUsersParams = {
  keyword?: string;
  page?: number;
  size?: number;
  /** Spring Pageable 형식. 예: "createdAt,desc" */
  sort?: string;
};

// 관리 화면은 변경 직후의 값을 봐야 하므로 캐시하지 않는다.
export const getAdminUsers = ({
  keyword,
  page,
  size,
  sort,
}: GetAdminUsersParams = {}): Promise<AdminUserPage> => {
  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  if (page !== undefined) params.set("page", String(page));
  if (size !== undefined) params.set("size", String(size));
  if (sort) params.set("sort", sort);
  const query = params.toString();

  return backendJson<AdminUserPage>(`/api/admin/users${query ? `?${query}` : ""}`);
};

// 권한 변경 응답은 userId·role·adminRole·status만 채워서 온다(이름·이메일 등은 null).
export type AdminUserChange = Pick<AdminUser, "userId" | "role" | "adminRole" | "status">;

const patchUser = (userId: number, action: string): Promise<AdminUserChange> =>
  backendJson<AdminUserChange>(`/api/admin/users/${userId}/${action}`, { method: "PATCH" });

export const grantAdmin = (userId: number) => patchUser(userId, "grant-admin");
export const revokeAdmin = (userId: number) => patchUser(userId, "revoke-admin");
export const grantSuperAdmin = (userId: number) => patchUser(userId, "grant-super-admin");
export const revokeSuperAdmin = (userId: number) => patchUser(userId, "revoke-super-admin");
export const approveCompany = (userId: number) => patchUser(userId, "approve-company");
