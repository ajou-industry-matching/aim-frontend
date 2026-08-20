"use client";

import { useCallback, useState } from "react";
import { deletePortfolio, type PortfolioBoardType } from "@/api/posts";
import { clearListCache } from "@/api/cache";

export type UseDeletePortfolioResult = {
  remove: (boardType: PortfolioBoardType, postId: number) => Promise<boolean>;
  isDeleting: boolean;
  error: Error | null;
};

const toErrorInstance = (cause: unknown): Error => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause);
  return new Error("포트폴리오 삭제에 실패했습니다.");
};

export const useDeletePortfolio = (): UseDeletePortfolioResult => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (boardType: PortfolioBoardType, postId: number) => {
    setIsDeleting(true);
    setError(null);
    try {
      await deletePortfolio(boardType, postId);
      clearListCache();
      return true;
    } catch (cause) {
      console.error("포트폴리오 삭제에 실패했습니다.", cause);
      setError(toErrorInstance(cause));
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { remove, isDeleting, error };
};
