"use client";

import { useState } from "react";
import Link from "next/link";

type UserRole = "슈퍼관리자" | "교수" | "학생" | "기업";
type UserStatus = "정상" | "비활성";

type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
  postCount: number;
  lastActivity: string;
  joinDate: string;
  status: UserStatus;
};

const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "김관리자",
    email: "super@ajou.ac.kr",
    role: "슈퍼관리자",
    isAdmin: true,
    postCount: 9,
    lastActivity: "2025.01.20",
    joinDate: "2023.03.01",
    status: "정상",
  },
  {
    id: 2,
    name: "이교수",
    email: "prof@ajou.ac.kr",
    role: "교수",
    isAdmin: true,
    postCount: 5,
    lastActivity: "2025.01.19",
    joinDate: "2023.09.01",
    status: "정상",
  },
  {
    id: 3,
    name: "박학생",
    email: "student@ajou.ac.kr",
    role: "학생",
    isAdmin: false,
    postCount: 12,
    lastActivity: "2025.01.19",
    joinDate: "2024.03.02",
    status: "정상",
  },
  {
    id: 4,
    name: "하기업",
    email: "company@example.com",
    role: "기업",
    isAdmin: false,
    postCount: 3,
    lastActivity: "2025.01.18",
    joinDate: "2024.06.15",
    status: "비활성",
  },
];

const ROLE_BADGE: Record<UserRole, string> = {
  슈퍼관리자: "rounded-full bg-red-50 text-red-600 py-1 px-3 text-[12px] font-semibold",
  교수: "rounded-full bg-blue-50 text-[#004a9c] py-1 px-3 text-[12px] font-semibold",
  학생: "rounded-full bg-green-50 text-green-600 py-1 px-3 text-[12px] font-semibold",
  기업: "rounded-full bg-purple-50 text-purple-600 py-1 px-3 text-[12px] font-semibold",
};

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const TOTAL_PAGES = 3;

export const AdminUsersPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = MOCK_USERS.filter((u) => u.name.includes(search) || u.email.includes(search));

  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#111]">사용자 관리</h1>
          <p className="mt-1 text-[14px] text-[#444]">플랫폼의 모든 사용자를 관리하세요.</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex h-10 items-center gap-2 rounded-md border border-[#e5e5e5] px-3 max-w-sm">
        <span className="shrink-0 text-[#999]">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름 또는 이메일 검색..."
          className="flex-1 bg-transparent text-[14px] text-[#333] placeholder-[#999] outline-none"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-[#e5e5e5]">
        <div className="min-w-225">
          {/* Header */}
          <div className="flex h-12 items-center border-b-2 border-[#e5e5e5] bg-[#f2f2f2] px-5 text-[14px] font-semibold text-[#333]">
            <span className="w-30 shrink-0">사용자</span>
            <span className="flex-1">이메일</span>
            <span className="w-30 shrink-0">권한</span>
            <span className="w-25 shrink-0">관리자 여부</span>
            <span className="w-16 shrink-0">게시글</span>
            <span className="w-28 shrink-0">마지막 활동</span>
            <span className="w-24 shrink-0">가입일</span>
            <span className="w-16 shrink-0">상태</span>
          </div>

          {/* Rows */}
          {filtered.map((user) => (
            <div
              key={user.id}
              className="flex min-h-14 items-center border-b border-[#e5e5e5] bg-white px-5 py-3 text-[14px] text-[#333] transition-colors hover:bg-[#f9f9f9]"
            >
              <Link
                href={`/admin/users/${user.id}`}
                className="w-30 shrink-0 font-medium hover:text-[#004a9c] hover:underline"
              >
                {user.name}
              </Link>
              <span className="flex-1 truncate text-[#555]">{user.email}</span>
              <span className="w-30 shrink-0">
                <span className={ROLE_BADGE[user.role]}>{user.role}</span>
              </span>
              <span className="w-25 shrink-0">
                <span
                  className={
                    user.isAdmin
                      ? "rounded-full bg-amber-50 text-amber-700 py-1 px-3 text-[12px] font-semibold"
                      : "rounded-full bg-gray-100 text-gray-400 py-1 px-3 text-[12px] font-semibold"
                  }
                >
                  {user.isAdmin ? "Y" : "N"}
                </span>
              </span>
              <span className="w-16 shrink-0">{user.postCount}</span>
              <span className="w-28 shrink-0 text-[#555]">{user.lastActivity}</span>
              <span className="w-24 shrink-0 text-[#555]">{user.joinDate}</span>
              <span className="w-16 shrink-0">
                <span
                  className={
                    user.status === "정상"
                      ? "rounded-full bg-green-50 text-green-600 py-1 px-2 text-[12px] font-semibold"
                      : "rounded-full bg-red-50 text-red-500 py-1 px-2 text-[12px] font-semibold"
                  }
                >
                  {user.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-1">
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={[
              "flex h-8 w-8 items-center justify-center rounded-md text-[14px] font-medium transition-colors",
              page === p
                ? "bg-[#004a9c] text-white"
                : "text-[#666] hover:bg-[#004a9c]/5 hover:text-[#004a9c]",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};
