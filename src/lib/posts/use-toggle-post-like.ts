"use client";

import { useCallback, useState } from "react";
import { togglePostLike, type PostLikeToggleResponse } from "@/api/posts";

export type UseTogglePostLikeResult = {
  toggle: (postId: number) => Promise<PostLikeToggleResponse | null>;
  isPending: boolean;
  error: Error | null;
};

const toErrorInstance = (cause: unknown): Error => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause);
  return new Error("좋아요 처리에 실패했습니다.");
};

export const useTogglePostLike = (): UseTogglePostLikeResult => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggle = useCallback(async (postId: number) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await togglePostLike(postId);
      return response;
    } catch (cause) {
      setError(toErrorInstance(cause));
      return null;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { toggle, isPending, error };
};
