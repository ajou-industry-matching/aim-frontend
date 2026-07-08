"use client";

import { useCallback, useState } from "react";
import {
  createPortfolio,
  type PortfolioBoardType,
  type PortfolioCreateFiles,
  type PortfolioCreateRequest,
  type PortfolioDetail,
} from "@/api/posts";

export type UseCreatePortfolioResult = {
  submit: (
    boardType: PortfolioBoardType,
    request: PortfolioCreateRequest,
    files: PortfolioCreateFiles,
  ) => Promise<PortfolioDetail | null>;
  isSubmitting: boolean;
  error: Error | null;
};

const toErrorInstance = (cause: unknown): Error => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause);
  return new Error("포트폴리오 저장에 실패했습니다.");
};

export const useCreatePortfolio = (): UseCreatePortfolioResult => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (
      boardType: PortfolioBoardType,
      request: PortfolioCreateRequest,
      files: PortfolioCreateFiles,
    ) => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await createPortfolio(boardType, request, files);
      } catch (cause) {
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
