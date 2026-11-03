"use client";

import { useEffect, useState } from "react";
import { getAdminUsers, type AdminUserPage } from "@/api/admin";

const ADMIN_USERS_PAGE_SIZE = 10;

export type UseAdminUsersResult = {
  data: AdminUserPage | null;
  isLoading: boolean;
  error: string | null;
};

type FetchResult = { key: string; data?: AdminUserPage; error?: string };

// page는 0부터 시작한다. 조건이 바뀌면 이전 결과를 보여주지 않는다.
export const useAdminUsers = (keyword: string, page: number): UseAdminUsersResult => {
  const [result, setResult] = useState<FetchResult | null>(null);
  const key = `${keyword}|${page}`;
  const isCurrent = result?.key === key;

  useEffect(() => {
    let isCancelled = false;

    getAdminUsers({
      keyword: keyword || undefined,
      page,
      size: ADMIN_USERS_PAGE_SIZE,
      sort: "createdAt,desc",
    })
      .then((data) => {
        if (!isCancelled) setResult({ key, data });
      })
      .catch((cause: unknown) => {
        console.error("[admin] 사용자 목록 조회 실패", cause);
        if (!isCancelled) {
          setResult({
            key,
            error: "사용자 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [key, keyword, page]);

  return {
    data: isCurrent ? (result.data ?? null) : null,
    isLoading: !isCurrent,
    error: isCurrent ? (result.error ?? null) : null,
  };
};
