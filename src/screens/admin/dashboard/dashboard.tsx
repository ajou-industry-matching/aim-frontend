"use client";

import Link from "next/link";

import { EmptyState } from "@/shared/ui/empty-states/empty-states";

type StatCard = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

// TODO: 백엔드 연동 후 실제 집계 데이터로 교체
const STAT_CARDS: StatCard[] = [
  {
    label: "총 사용자",
    value: "—",
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
    value: "—",
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
    value: "—",
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
            <EmptyState
              variant="coming-soon"
              title="최근 가입한 사용자 데이터가 없습니다"
              description="백엔드 연동 준비 중입니다"
              className="min-h-[220px] py-8"
            />
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
            <EmptyState
              variant="coming-soon"
              title="최근 공지사항 데이터가 없습니다"
              description="백엔드 연동 준비 중입니다"
              className="min-h-[220px] py-8"
            />
          </div>
        </section>
      </div>
    </div>
  );
};
