"use client";

import { useEffect, useState } from "react";
import { getPosts, type PostListResponse } from "@/api/posts";

export const ADMIN_PORTFOLIOS_PAGE_SIZE = 10;

export type UseAdminPortfoliosResult = {
  data: PostListResponse | null;
  isLoading: boolean;
  error: string | null;
};

type FetchResult = { key: string; data?: PostListResponse; error?: string };

// page는 0부터 시작한다. 백엔드 목록은 공개 글만 돌려준다.
export const useAdminPortfolios = (keyword: string, page: number): UseAdminPortfoliosResult => {
  const [result, setResult] = useState<FetchResult | null>(null);
  const key = `${keyword}|${page}`;
  const isCurrent = result?.key === key;

  useEffect(() => {
    let isCancelled = false;

    getPosts("PORTFOLIO", {
      page,
      size: ADMIN_PORTFOLIOS_PAGE_SIZE,
      sort: "LATEST",
      keyword: keyword || undefined,
    })
      .then((data) => {
        if (!isCancelled) setResult({ key, data });
      })
      .catch((cause: unknown) => {
        console.error("[admin] 포트폴리오 목록 조회 실패", cause);
        if (!isCancelled) {
          setResult({
            key,
            error: "포트폴리오 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
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
