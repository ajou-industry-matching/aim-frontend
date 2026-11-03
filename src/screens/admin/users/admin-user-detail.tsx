"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AdminRole, AdminUser } from "@/api/admin";
import { authRoleLabels, useAuthSession } from "@/lib/auth";
import { readSelectedAdminUser, useAdminUserActions } from "@/lib/admin";
import { Button, Input, Select } from "@/shared/ui";
import { ChevronLeftIcon } from "@/shared/ui/icons";
import { formatDate } from "../format-date";
import { toUserStatusLabel } from "../user-badges";

const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  NONE: "없음",
  ADMIN: "일반관리자",
  SUPER_ADMIN: "슈퍼관리자",
};

const adminRoleOptions = (Object.keys(ADMIN_ROLE_LABELS) as AdminRole[]).map((value) => ({
  label: ADMIN_ROLE_LABELS[value],
  value,
}));

const labelClasses = "block text-[14px] font-medium text-[var(--color-gray-900,#1a1a1a)]";

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-2">
    <span className={labelClasses}>{label}</span>
    <Input size="medium" isFullWidth value={value} disabled readOnly aria-label={label} />
  </div>
);

const AdminUserDetail = ({ initialUser }: { initialUser: AdminUser }) => {
  const router = useRouter();
  const { session } = useAuthSession();
  const { user, isSubmitting, error, changeAdminRole, approve } = useAdminUserActions(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [draftRole, setDraftRole] = useState<AdminRole>(initialUser.adminRole);

  const isSuperAdmin = session?.adminRole === "SUPER_ADMIN";
  // 본인 권한을 바꾸면 이 화면에서 바로 쫓겨날 수 있어 막는다.
  const isSelf = session?.userId === user.userId;
  const canEditRole = isSuperAdmin && !isSelf;
  const canApprove = user.role === "COMPANY" && user.status === "PENDING";

  const handleCancel = () => {
    setDraftRole(user.adminRole);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (draftRole === user.adminRole) {
      setIsEditing(false);
      return;
    }
    const message = `${user.name}님의 관리자 권한을 "${ADMIN_ROLE_LABELS[draftRole]}"(으)로 변경하시겠습니까?`;
    if (!window.confirm(message)) return;
    if (await changeAdminRole(draftRole)) setIsEditing(false);
  };

  const handleApprove = () => {
    if (window.confirm(`${user.name} 기업 회원을 승인하시겠습니까?`)) void approve();
  };

  return (
    <div className="flex-1 space-y-6 bg-white p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            icon={<ChevronLeftIcon />}
            onClick={() => router.push("/admin/users")}
            aria-label="목록으로"
            className="shrink-0"
          />
          <div>
            <h1 className="text-[32px] font-bold text-[var(--color-gray-900,#1a1a1a)]">
              사용자 상세 정보
            </h1>
            <p className="text-[14px] text-[var(--color-gray-600,#666666)]">
              사용자 정보를 조회하고 권한을 변경할 수 있습니다.
            </p>
          </div>
        </div>
        {canEditRole && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
                  취소
                </Button>
                <Button onClick={() => void handleSave()} isLoading={isSubmitting}>
                  저장
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>수정</Button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-[14px] text-[var(--color-error-500,#ef4444)]">
          {error}
        </p>
      )}

      <div className="rounded-lg border border-[var(--color-gray-200,#e5e5e5)] bg-white p-8">
        <h2 className="mb-6 text-[20px] font-semibold text-[var(--color-gray-900,#1a1a1a)]">
          기본 정보
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <ReadOnlyField label="이름" value={user.name} />
          <ReadOnlyField label="이메일" value={user.email} />
          <ReadOnlyField label="역할" value={authRoleLabels[user.role]} />
          <div className="space-y-2">
            <label htmlFor="adminRole" className={labelClasses}>
              관리자 권한
              {!isSuperAdmin && (
                <span className="ml-2 text-[11px] font-normal text-[var(--color-gray-500,#808080)]">
                  (슈퍼관리자만 변경 가능)
                </span>
              )}
              {isSelf && isSuperAdmin && (
                <span className="ml-2 text-[11px] font-normal text-[var(--color-gray-500,#808080)]">
                  (본인 권한은 변경 불가)
                </span>
              )}
            </label>
            <Select
              id="adminRole"
              isFullWidth
              options={adminRoleOptions}
              value={isEditing ? draftRole : user.adminRole}
              onChange={(event) => setDraftRole(event.target.value as AdminRole)}
              disabled={!isEditing || isSubmitting}
            />
          </div>
          <ReadOnlyField label="학과" value={user.department ?? "-"} />
          <ReadOnlyField label="가입일" value={formatDate(user.createdAt)} />
          <div className="space-y-2">
            <span className={labelClasses}>상태</span>
            <div className="flex items-center gap-3">
              <Input
                size="medium"
                isFullWidth
                value={toUserStatusLabel(user.status)}
                disabled
                readOnly
                aria-label="상태"
              />
              {canApprove && (
                <Button
                  onClick={handleApprove}
                  isLoading={isSubmitting}
                  className="shrink-0 whitespace-nowrap"
                >
                  기업 승인
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminUserDetailRoute = () => {
  const router = useRouter();
  const id = useSearchParams().get("id");
  const userId = id !== null && /^\d+$/.test(id) ? Number(id) : null;
  // useSearchParams로 서스펜드되어 클라이언트에서만 렌더되므로 sessionStorage를 바로 읽을 수 있다.
  const [initialUser] = useState(() => (userId === null ? null : readSelectedAdminUser(userId)));

  // 단건 조회 API가 없어 다른 탭이나 직접 입력한 주소로는 정보를 알 수 없다.
  useEffect(() => {
    if (!initialUser) router.replace("/admin/users");
  }, [initialUser, router]);

  return initialUser ? <AdminUserDetail initialUser={initialUser} /> : null;
};
