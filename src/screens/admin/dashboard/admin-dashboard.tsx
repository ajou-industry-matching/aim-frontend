"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useAdminDashboard } from "@/lib/admin";
import { ArrowRightIcon, BellIcon, FileTextAltIcon, UserIcon } from "@/shared/ui/icons";
import { Loading } from "@/shared/ui/loading";
import { formatDate } from "../format-date";
import { AdminFlagBadge, UserRoleBadge } from "../user-badges";

const SECTION_ERROR_MESSAGE = "불러오지 못했습니다.";

const cardClasses = "rounded-lg border border-[var(--color-gray-200,#e5e5e5)] bg-white p-6";
const rowClasses =
  "flex items-center justify-between border-b border-[var(--color-gray-200,#e5e5e5)] pb-4 last:border-0 last:pb-0";

type StatCardProps = {
  title: string;
  value: number | null;
  icon: ReactNode;
  iconClassName: string;
};

const StatCard = ({ title, value, icon, iconClassName }: StatCardProps) => (
  <div className={`${cardClasses} flex items-center justify-between`}>
    <div>
      <p className="mb-2 text-[14px] leading-[1.43] tracking-[-0.35px] text-[var(--color-gray-600,#666666)]">
        {title}
      </p>
      <p className="text-[32px] font-bold leading-[1.25] tracking-[-0.8px] text-[var(--color-gray-900,#1a1a1a)]">
        {value === null ? "-" : value.toLocaleString()}
      </p>
    </div>
    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconClassName}`}>
      {icon}
    </div>
  </div>
);

type RecentSectionProps = {
  title: string;
  href?: string;
  children: ReactNode;
};

const RecentSection = ({ title, href, children }: RecentSectionProps) => (
  <section>
    <div className="mb-4 flex h-10 items-center justify-between">
      <h2 className="text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[var(--color-gray-900,#1a1a1a)]">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 rounded-md px-3 py-2 text-[14px] text-[var(--color-primary-800,#004a9c)] hover:bg-[var(--color-primary-50,#f0f6fd)]"
        >
          전체보기
          <ArrowRightIcon size={16} />
        </Link>
      )}
    </div>
    <div className={cardClasses}>
      <div className="space-y-4">{children}</div>
    </div>
  </section>
);

const SectionMessage = ({ children }: { children: ReactNode }) => (
  <p className="py-4 text-center text-[14px] text-[var(--color-gray-500,#808080)]">{children}</p>
);

export const AdminDashboardPage = () => {
  const { data, isLoading } = useAdminDashboard();

  return (
    <div className="flex-1 space-y-8 bg-white p-8">
      <div>
        <h1 className="mb-2 text-[40px] font-bold leading-[1.3] tracking-[-1px] text-[var(--color-gray-900,#1a1a1a)]">
          대시보드
        </h1>
        <p className="text-[16px] leading-[1.5] tracking-[-0.4px] text-[var(--color-gray-600,#666666)]">
          플랫폼 전체 현황을 확인하세요
        </p>
      </div>

      {isLoading || !data ? (
        <div className="flex justify-center py-16">
          <Loading text="불러오는 중" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="총 사용자"
              value={data.userTotal}
              icon={<UserIcon size={28} />}
              iconClassName="bg-[var(--color-primary-100,#e0edfb)] text-[var(--color-primary-800,#004a9c)]"
            />
            <StatCard
              title="총 공지사항"
              value={data.noticeTotal}
              icon={<BellIcon size={28} />}
              iconClassName="bg-[var(--color-info-100,#dbeafe)] text-[var(--color-info-700,#1d4ed8)]"
            />
            <StatCard
              title="총 포트폴리오"
              value={data.portfolioTotal}
              icon={<FileTextAltIcon size={28} />}
              iconClassName="bg-[var(--color-success-100,#dcfce7)] text-[var(--color-success-700,#15803d)]"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentSection title="최근 가입한 사용자" href="/admin/users">
              {data.recentUsers === null ? (
                <SectionMessage>{SECTION_ERROR_MESSAGE}</SectionMessage>
              ) : data.recentUsers.length === 0 ? (
                <SectionMessage>가입한 사용자가 없습니다.</SectionMessage>
              ) : (
                data.recentUsers.map((user) => (
                  <div key={user.userId} className={rowClasses}>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium leading-[1.43] tracking-[-0.35px] text-[var(--color-gray-900,#1a1a1a)]">
                        {user.name}
                      </p>
                      <p className="truncate text-[12px] leading-[1.33] tracking-[-0.3px] text-[var(--color-gray-600,#666666)]">
                        {user.email}
                      </p>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-2">
                      <UserRoleBadge user={user} />
                      <AdminFlagBadge adminRole={user.adminRole} />
                      <span className="text-[12px] leading-[1.33] tracking-[-0.3px] text-[var(--color-gray-400,#999999)]">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </RecentSection>

            <RecentSection title="최근 공지사항" href="/admin/notices">
              {data.recentNotices === null ? (
                <SectionMessage>{SECTION_ERROR_MESSAGE}</SectionMessage>
              ) : data.recentNotices.length === 0 ? (
                <SectionMessage>등록된 공지사항이 없습니다.</SectionMessage>
              ) : (
                data.recentNotices.map((notice) => (
                  // 호버 배경은 구분선과 같은 너비로 두고, 글자만 안쪽으로 띄운다.
                  <div key={notice.postId} className={rowClasses}>
                    <Link
                      href={`/admin/notices/edit?id=${notice.postId}`}
                      className="-my-2 flex min-w-0 flex-1 items-center justify-between px-2 py-2 transition-colors hover:bg-[var(--color-gray-50,#f9f9f9)]"
                    >
                      <p className="min-w-0 flex-1 truncate text-[14px] leading-[1.43] tracking-[-0.35px] text-[var(--color-gray-900,#1a1a1a)]">
                        {notice.title}
                      </p>
                      <span className="ml-4 shrink-0 text-[12px] leading-[1.33] tracking-[-0.3px] text-[var(--color-gray-400,#999999)]">
                        {formatDate(notice.createdAt)}
                      </span>
                    </Link>
                  </div>
                ))
              )}
            </RecentSection>
          </div>
        </>
      )}
    </div>
  );
};
