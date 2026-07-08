"use client";

import { useCallback, useState } from "react";
import {
  updatePortfolio,
  type PortfolioBoardType,
  type PortfolioCreateFiles,
  type PortfolioDetail,
  type PortfolioUpdateRequest,
} from "@/api/posts";

export type UseUpdatePortfolioResult = {
  submit: (
    boardType: PortfolioBoardType,
    postId: number,
    request: PortfolioUpdateRequest,
    files: PortfolioCreateFiles,
  ) => Promise<PortfolioDetail | null>;
  isSubmitting: boolean;
  error: Error | null;
};

const toErrorInstance = (cause: unknown): Error => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause);
  return new Error("포트폴리오 수정에 실패했습니다.");
};

export const useUpdatePortfolio = (): UseUpdatePortfolioResult => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (
      boardType: PortfolioBoardType,
      postId: number,
      request: PortfolioUpdateRequest,
      files: PortfolioCreateFiles,
    ) => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await updatePortfolio(boardType, postId, request, files);
      } catch (cause) {
        console.error("포트폴리오 수정에 실패했습니다.", cause);
        setError(toErrorInstance(cause));
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { submit, isSubmitting, error };
};
