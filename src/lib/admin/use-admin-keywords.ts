"use client";

import { useEffect, useState } from "react";
import { clearListCache } from "@/api/cache";
import { createKeyword, deleteKeyword, updateKeyword } from "@/api/admin";
import { getKeywords, type PortfolioKeyword } from "@/api/posts";

export type UseAdminKeywordsResult = {
  keywords: PortfolioKeyword[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  create: (name: string) => Promise<boolean>;
  rename: (keywordId: number, name: string) => Promise<boolean>;
  remove: (keywordId: number) => Promise<boolean>;
};

export const useAdminKeywords = (): UseAdminKeywordsResult => {
  const [keywords, setKeywords] = useState<PortfolioKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    getKeywords()
      .then((data) => {
        if (!isCancelled) setKeywords(data);
      })
      .catch((cause: unknown) => {
        console.error("[admin] 태그 목록 조회 실패", cause);
        if (!isCancelled) setError("태그 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const hasName = (name: string, exceptId?: number) =>
    keywords.some(
      (keyword) =>
        keyword.keywordId !== exceptId && keyword.keywordName.toLowerCase() === name.toLowerCase(),
    );

  const run = async (request: () => Promise<void>, message: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await request();
      // 태그는 포트폴리오 목록·상세에도 표시된다.
      clearListCache();
      return true;
    } catch (cause) {
      console.error(`[admin] ${message}`, cause);
      setError(`${message}. 잠시 후 다시 시도해주세요.`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const create = async (name: string) => {
    if (hasName(name)) {
      setError("이미 있는 태그입니다.");
      return false;
    }
    return run(async () => {
      const created = await createKeyword(name);
      setKeywords((current) => [...current, created]);
    }, "태그를 추가하지 못했습니다");
  };

  const rename = async (keywordId: number, name: string) => {
    if (hasName(name, keywordId)) {
      setError("이미 있는 태그입니다.");
      return false;
    }
    return run(async () => {
      const updated = await updateKeyword(keywordId, name);
      setKeywords((current) =>
        current.map((keyword) => (keyword.keywordId === keywordId ? updated : keyword)),
      );
    }, "태그를 수정하지 못했습니다");
  };

  const remove = (keywordId: number) =>
    run(async () => {
      await deleteKeyword(keywordId);
      setKeywords((current) => current.filter((keyword) => keyword.keywordId !== keywordId));
    }, "태그를 삭제하지 못했습니다");

  return { keywords, isLoading, isSubmitting, error, create, rename, remove };
};
