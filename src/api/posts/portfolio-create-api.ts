import { backendJson } from "@/api/client";
import type { PortfolioBoardType, PortfolioVisibility } from "./portfolio-api";
import type { PortfolioDetail } from "./portfolio-detail-api";

// POST /api/posts/{boardType} 의 JSON 파트(request)
export type PortfolioCreateRequest = {
  title: string;
  description?: string;
  content?: string;
  videoLink?: string;
  githubLink?: string;
  visibility?: PortfolioVisibility;
  keywordIds?: number[];
};

// multipart 파일 파트
export type PortfolioCreateFiles = {
  thumbnail?: File | null;
  images?: File[];
  files?: File[];
};

export const createPortfolio = async (
  boardType: PortfolioBoardType,
  request: PortfolioCreateRequest,
  { thumbnail, images = [], files = [] }: PortfolioCreateFiles = {},
): Promise<PortfolioDetail> => {
  const formData = new FormData();
  // Spring @RequestPart("request"): JSON을 application/json Blob 파트로 전송
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }
  images.forEach((image) => formData.append("images", image));
  files.forEach((file) => formData.append("files", file));

  // 작성은 로그인 필요(requiresAuth 기본값 true). FormData는 client가 Content-Type을 자동 처리한다.
  return backendJson<PortfolioDetail>(`/api/posts/${boardType}`, {
    method: "POST",
    body: formData,
  });
};
