import { backendJson } from "@/api/client";
import type { PortfolioBoardType, PortfolioVisibility } from "./portfolio-api";
import type { PortfolioCreateFiles } from "./portfolio-create-api";
import type { PortfolioDetail } from "./portfolio-detail-api";

// PUT /api/posts/{boardType}/{postId} 의 JSON 파트(request)
export type PortfolioUpdateRequest = {
  title?: string;
  description?: string;
  content?: string;
  videoLink?: string;
  githubLink?: string;
  visibility?: PortfolioVisibility;
  keywordIds?: number[];
  deleteAttachmentIds?: number[];
};

export const updatePortfolio = async (
  boardType: PortfolioBoardType,
  postId: number,
  request: PortfolioUpdateRequest,
  { thumbnail, images = [], files = [] }: PortfolioCreateFiles = {},
): Promise<PortfolioDetail> => {
  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }
  images.forEach((image) => formData.append("images", image));
  files.forEach((file) => formData.append("files", file));

  return backendJson<PortfolioDetail>(`/api/posts/${boardType}/${postId}`, {
    method: "PUT",
    body: formData,
  });
};
