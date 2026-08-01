"use client";

import { useEffect, useState } from "react";
import { getLikedPosts, getMyPosts, type PortfolioListItem } from "@/api/posts";

// 프로필 탭: 내 게시글 / 좋아요한 게시글
export type ProfilePostsTab = "my" | "liked";

export type UseProfilePostsResult = {
  posts: PortfolioListItem[];
  isLoading: boolean;
  error: Error | null;
};

const profilePostsFetchers: Record<
  ProfilePostsTab,
  () => Promise<{ content: PortfolioListItem[] }>
> = {
  my: () => getMyPosts(),
  liked: () => getLikedPosts(),
};

const toErrorInstance = (cause: unknown): Error => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause);
  return new Error("게시글을 불러오지 못했습니다.");
};

// 탭당 하나의 인스턴스로 호출한다(고정 tab). 각 탭은 마운트 시 1회 조회한다.
export const useProfilePosts = (tab: ProfilePostsTab): UseProfilePostsResult => {
  const [posts, setPosts] = useState<PortfolioListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    profilePostsFetchers[tab]()
      .then((response) => {
        if (isCancelled) return;
        setPosts(response.content);
      })
      .catch((cause: unknown) => {
        if (isCancelled) return;
        console.error("게시글을 불러오지 못했습니다.", cause);
        setError(toErrorInstance(cause));
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [tab]);

  return { posts, isLoading, error };
};
