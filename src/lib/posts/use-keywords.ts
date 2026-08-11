"use client";

import { useEffect, useState } from "react";
import { getKeywords, type PortfolioKeyword } from "@/api/posts";

export type UseKeywordsResult = {
  keywords: PortfolioKeyword[];
  isLoading: boolean;
  error: Error | null;
};

const toErrorInstance = (cause: unknown): Error => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause);
  return new Error("키워드를 불러오지 못했습니다.");
};

export const useKeywords = (): UseKeywordsResult => {
  const [keywords, setKeywords] = useState<PortfolioKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    getKeywords()
      .then((response) => {
        if (isCancelled) return;
        setKeywords(response);
      })
      .catch((cause: unknown) => {
        if (isCancelled) return;
        setError(toErrorInstance(cause));
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return { keywords, isLoading, error };
};
