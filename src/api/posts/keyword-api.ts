import { backendJson } from "@/api/client";
import type { PortfolioKeyword } from "./portfolio-api";

// 전체 키워드 조회. 작성 폼의 태그 선택 목록으로 사용한다.
export const getKeywords = async (): Promise<PortfolioKeyword[]> => {
  // 공개 조회: 비로그인도 접근 가능
  return backendJson<PortfolioKeyword[]>("/api/keywords", {
    requiresAuth: false,
  });
};
