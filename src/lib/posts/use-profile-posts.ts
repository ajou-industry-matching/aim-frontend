"use client";

import { useEffect, useState } from "react";
import {
  getLikedPosts,
  getMyPosts,
  type PortfolioListItem,
  type PortfolioListPageResponse,
} from "@/api/posts";

// 프로필 탭: 내 게시글 / 좋아요한 게시글
export type ProfilePostsTab = "my" | "liked";

export type UseProfilePostsResult = {
  posts: PortfolioListItem[];
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  error: Error | null;
};

const PROFILE_POSTS_PAGE_SIZE = 12;

type ProfilePostsFetchResult = {
  key: string;
  data?: PortfolioListPageResponse;
  error?: Error;
};

const toProfilePostsKey = (tab: ProfilePostsTab, page: number): string => `${tab}|${page}`;

const toErrorInstance = (cause: unknown): Error => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause);
  return new Error("게시글을 불러오지 못했습니다.");
};

// page 는 1-based. 탭/페이지가 바뀌면 해당 페이지를 다시 조회한다.
export const useProfilePosts = (tab: ProfilePostsTab, page: number): UseProfilePostsResult => {
  const [result, setResult] = useState<ProfilePostsFetchResult | null>(null);
  const key = toProfilePostsKey(tab, page);
  const hasMatchingResult = result?.key === key;
  const isLoading = !hasMatchingResult;
  const data = hasMatchingResult ? result.data : undefined;
  const error = hasMatchingResult ? (result.error ?? null) : null;

  useEffect(() => {
    let isCancelled = false;
    const requestKey = toProfilePostsKey(tab, page);
    const fetchPosts = tab === "my" ? getMyPosts : getLikedPosts;

    fetchPosts({ page: page - 1, size: PROFILE_POSTS_PAGE_SIZE })
      .then((response) => {
        if (isCancelled) return;
        setResult({ key: requestKey, data: response });
      })
      .catch((cause: unknown) => {
        if (isCancelled) return;
        console.error("게시글을 불러오지 못했습니다.", cause);
        setResult({ key: requestKey, error: toErrorInstance(cause) });
      });

    return () => {
      isCancelled = true;
    };
  }, [tab, page]);

  return {
    posts: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    error,
  };
};
