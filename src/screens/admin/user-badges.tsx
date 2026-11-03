import type { AdminUser } from "@/api/admin";
import { authRoleLabels } from "@/lib/auth";
import { Badge, type BadgeVariant } from "@/shared/ui/badge";

const roleBadgeVariants: Record<AdminUser["role"], BadgeVariant> = {
  STUDENT: "success",
  PROFESSOR: "primary",
  COMPANY: "info",
};

// 권한 뱃지: 슈퍼관리자이면 회원 종류 대신 슈퍼관리자로 표시한다.
export const UserRoleBadge = ({ user }: { user: Pick<AdminUser, "role" | "adminRole"> }) =>
  user.adminRole === "SUPER_ADMIN" ? (
    <Badge variant="error" className="rounded-full">
      슈퍼관리자
    </Badge>
  ) : (
    <Badge variant={roleBadgeVariants[user.role]} className="rounded-full">
      {authRoleLabels[user.role]}
    </Badge>
  );

export const AdminFlagBadge = ({ adminRole }: { adminRole: AdminUser["adminRole"] }) => {
  const isAdmin = adminRole !== "NONE";

  return (
    <Badge variant={isAdmin ? "warning" : "secondary"} className="rounded-full">
      관리자 {isAdmin ? "Y" : "N"}
    </Badge>
  );
};
