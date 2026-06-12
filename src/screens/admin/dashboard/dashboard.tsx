"use client";

import Link from "next/link";

type StatCard = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

type RecentUser = {
  name: string;
  email: string;
  status: "재학중" | "공고" | "학교" | "정지";
  joinedAt: string;
};

type RecentNotice = {
  title: string;
  createdAt: string;
};

const STAT_CARDS: StatCard[] = [
  {
    label: "총 사용자",
    value: "2,847",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "총 공지사항",
    value: "156",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "총 포트폴리오수",
    value: "1,234",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
];

const RECENT_USERS: RecentUser[] = [
  { name: "김철수", email: "user1@ajou.ac.kr", status: "재학중", joinedAt: "2025.03.05" },
  { name: "이영희", email: "user2@ajou.ac.kr", status: "공고", joinedAt: "2025.03.05" },
  { name: "박민수", email: "user3@ajou.ac.kr", status: "학교", joinedAt: "2025.03.07" },
  { name: "최지훈", email: "user4@ajou.ac.kr", status: "정지", joinedAt: "2025.03.07" },
  { name: "김사연", email: "user5@ajou.ac.kr", status: "재학중", joinedAt: "2025.03.08" },
];

const RECENT_NOTICES: RecentNotice[] = [
  { title: "2029학년도 1학기 포트폴리오 공모전 안내", createdAt: "2025.03.01" },
  { title: "시스템 점검 안내", createdAt: "2025.03.02" },
  { title: "신규 기능 업데이트 안내", createdAt: "2025.03.03" },
  { title: "메인터넌스 작업 완료 안내", createdAt: "2025.03.07" },
  { title: "개발완성 컨텐츠 안내", createdAt: "2025.03.08" },
];

const STATUS_STYLE: Record<RecentUser["status"], string> = {
  재학중: "bg-emerald-50 text-emerald-600",
  공고: "bg-orange-50 text-orange-500",
  학교: "bg-blue-50 text-blue-500",
  정지: "bg-red-50 text-red-500",
};

export const AdminDashboardPage = () => {
  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header */}
      <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-1px] text-[#1a1a1a]">
        대시보드
      </h1>
      <p className="mt-2 text-[16px] leading-[1.5] tracking-[-0.4px] text-[#666]">
        공지를 전체 관련을 확인하세요
      </p>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="rounded-lg border border-[#e5e5e5] bg-white p-6">
            <p className="text-[14px] leading-[1.43] tracking-[-0.35px] text-[#666]">
              {card.label}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[32px] font-bold leading-[1.25] tracking-[-0.8px] text-[#1a1a1a]">
                {card.value}
              </p>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sections */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        {/* 최근 가입한 사용자 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
              최근 가입한 사용자
            </h2>
            <Link
              href="/admin/users"
              className="rounded px-2 py-1 text-[14px] text-[#004a9c] transition-colors hover:bg-[#004a9c]/5"
            >
              전체보기 &gt;
            </Link>
          </div>
          <div className="rounded-lg border border-[#e5e5e5] bg-white p-6">
            <div className="flex flex-col gap-4">
              {RECENT_USERS.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between rounded-md px-2 py-1 transition-colors hover:bg-[#f9f9f9]"
                >
                  <div>
                    <p className="text-[14px] font-medium leading-[1.43] tracking-[-0.35px] text-[#1a1a1a]">
                      {user.name}
                    </p>
                    <p className="text-[12px] leading-[1.33] tracking-[-0.3px] text-[#666]">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-[12px] font-medium leading-normal",
                        STATUS_STYLE[user.status],
                      ].join(" ")}
                    >
                      {user.status}
                    </span>
                    <span className="text-[12px] leading-[1.33] tracking-[-0.3px] text-[#999]">
                      {user.joinedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 최근 공지사항 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
              최근 공지사항
            </h2>
            <Link
              href="/admin/notices"
              className="rounded px-2 py-1 text-[14px] text-[#004a9c] transition-colors hover:bg-[#004a9c]/5"
            >
              전체보기 &gt;
            </Link>
          </div>
          <div className="rounded-lg border border-[#e5e5e5] bg-white p-6">
            <div className="flex flex-col gap-4">
              {RECENT_NOTICES.map((notice, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md px-2 py-1 transition-colors hover:bg-[#f9f9f9]"
                >
                  <p className="flex-1 truncate text-[14px] font-normal leading-[1.43] tracking-[-0.35px] text-[#1a1a1a]">
                    {notice.title}
                  </p>
                  <span className="ml-4 shrink-0 text-[12px] leading-[1.33] tracking-[-0.3px] text-[#999]">
                    {notice.createdAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
