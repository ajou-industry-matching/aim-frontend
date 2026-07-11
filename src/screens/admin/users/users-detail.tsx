"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

type Props = { id: string };

const MOCK_USER = {
  name: "김관리자",
  email: "super@ajou.ac.kr",
  role: "슈퍼관리자" as const,
  adminRole: "슈퍼관리자" as const,
  postCount: 9,
  lastActivity: "2025.01.20",
  joinDate: "2023.03.01",
  status: "정상" as const,
  userId: "user_001",
};

const ROLES = ["학생", "교수", "기업", "슈퍼관리자"] as const;
const ADMIN_ROLES = ["없음", "일반관리자", "슈퍼관리자"] as const;

export const AdminUsersDetailPage = ({ id }: Props) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const user = { ...MOCK_USER, userId: id };
  const [role, setRole] = useState(user.role);
  const [adminRole, setAdminRole] = useState(user.adminRole);

  const isAdminRoleDisabled = role === "슈퍼관리자";

  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/users")}
            className="mb-3 flex items-center gap-1 text-[14px] text-[#666] transition-colors hover:text-[#111]"
          >
            <BackIcon />
            목록으로
          </button>
          <h1 className="text-[32px] font-bold text-[#111]">사용자 상세 정보</h1>
          <p className="mt-1 text-[14px] text-[#444]">사용자 정보를 조회하고 수정할 수 있습니다.</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="h-10 px-6 py-2.5 border border-[#e5e5e5] rounded-lg text-[#111] text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-[#f9f9f9]"
              >
                취소
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="h-10 px-6 py-2.5 rounded-lg bg-[#004a9c] text-white text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-[#003d8a]"
              >
                저장
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="h-10 px-6 py-2.5 border border-[#e5e5e5] rounded-lg text-[#111] text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-[#f9f9f9]"
            >
              수정
            </button>
          )}
          <button className="h-10 px-6 py-2.5 border border-red-500 rounded-lg text-red-500 text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-red-50">
            삭제
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <section className="rounded-lg border border-[#e5e5e5] bg-white p-6">
        <h2 className="mb-6 text-[20px] font-semibold text-[#111]">기본 정보</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">이름</label>
            <input
              type="text"
              defaultValue={MOCK_USER.name}
              disabled
              className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">이메일</label>
            <input
              type="text"
              defaultValue={MOCK_USER.email}
              disabled
              className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">역할</label>
            {isEditing ? (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as typeof role)}
                className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#333] outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={role}
                disabled
                className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
              />
            )}
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">관리자 권한</label>
            {isEditing ? (
              <select
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value as typeof adminRole)}
                disabled={isAdminRoleDisabled}
                className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#333] outline-none disabled:bg-[#f5f5f5] disabled:text-[#999]"
              >
                {ADMIN_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={adminRole}
                disabled
                className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
              />
            )}
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">게시글 수</label>
            <input
              type="text"
              value={MOCK_USER.postCount}
              disabled
              className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">마지막 활동</label>
            <input
              type="text"
              value={MOCK_USER.lastActivity}
              disabled
              className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">가입일</label>
            <input
              type="text"
              value={MOCK_USER.joinDate}
              disabled
              className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">상태</label>
            <div className="flex h-10 items-center gap-3">
              <span className="rounded-full bg-green-50 px-3 py-1 text-[12px] font-semibold text-green-600">
                {MOCK_USER.status}
              </span>
              {isEditing && (
                <button className="h-8 rounded-lg border border-red-500 px-3 text-[12px] font-medium text-red-500 transition-colors hover:bg-red-50">
                  정지
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="mb-2 block text-[14px] font-medium text-[#333]">사용자 ID</label>
            <input
              type="text"
              value={MOCK_USER.userId}
              disabled
              className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
