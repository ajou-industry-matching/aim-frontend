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

type AdminFlagBadgeProps = {
  adminRole: AdminUser["adminRole"];
  /** 컬럼 제목이 있는 표에서는 Y/N만 표시한다. */
  isCompact?: boolean;
};

export const AdminFlagBadge = ({ adminRole, isCompact = false }: AdminFlagBadgeProps) => {
  const isAdmin = adminRole !== "NONE";
  const value = isAdmin ? "Y" : "N";

  return (
    <Badge variant={isAdmin ? "warning" : "secondary"} className="rounded-full">
      {isCompact ? value : `관리자 ${value}`}
    </Badge>
  );
};

const statusBadges: Record<AdminUser["status"], { label: string; variant: BadgeVariant }> = {
  ACTIVE: { label: "정상", variant: "success" },
  PENDING: { label: "승인 대기", variant: "warning" },
  SUSPENDED: { label: "정지", variant: "error" },
  BLOCKED: { label: "차단", variant: "error" },
};

export const toUserStatusLabel = (status: AdminUser["status"]): string =>
  statusBadges[status].label;

export const UserStatusBadge = ({ status }: { status: AdminUser["status"] }) => (
  <Badge variant={statusBadges[status].variant} className="rounded-full">
    {statusBadges[status].label}
  </Badge>
);
