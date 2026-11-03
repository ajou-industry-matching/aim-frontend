"use client";

import { useEffect, useState } from "react";
import { getAdminUsers, type AdminUser } from "@/api/admin";
import { getPosts, type Post } from "@/api/posts";

const RECENT_ITEM_COUNT = 5;

// 섹션별 값. 해당 API가 실패하면 null이라 나머지 섹션은 그대로 보여줄 수 있다.
export type AdminDashboardData = {
  userTotal: number | null;
  noticeTotal: number | null;
  portfolioTotal: number | null;
  recentUsers: AdminUser[] | null;
  recentNotices: Post[] | null;
};

export type UseAdminDashboardResult = {
  data: AdminDashboardData | null;
  isLoading: boolean;
};

const toFulfilled = <T>(result: PromiseSettledResult<T>, label: string): T | null => {
  if (result.status === "fulfilled") return result.value;
  console.error(`[admin] ${label} 조회 실패`, result.reason);
  return null;
};

export const useAdminDashboard = (): UseAdminDashboardResult => {
  const [data, setData] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    let isCancelled = false;

    void Promise.allSettled([
      getAdminUsers({ size: RECENT_ITEM_COUNT, sort: "createdAt,desc" }),
      getPosts("NOTICE", { size: RECENT_ITEM_COUNT, sort: "LATEST" }),
      getPosts("PORTFOLIO", { size: 1 }),
    ]).then(([usersResult, noticesResult, portfoliosResult]) => {
      if (isCancelled) return;

      const users = toFulfilled(usersResult, "사용자");
      const notices = toFulfilled(noticesResult, "공지사항");
      const portfolios = toFulfilled(portfoliosResult, "포트폴리오");

      setData({
        userTotal: users?.totalElements ?? null,
        noticeTotal: notices?.totalElements ?? null,
        portfolioTotal: portfolios?.totalElements ?? null,
        recentUsers: users?.content ?? null,
        recentNotices: notices?.content ?? null,
      });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return { data, isLoading: data === null };
};
