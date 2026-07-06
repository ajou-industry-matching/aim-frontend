import { backendJson } from "@/api/client";
import type { PortfolioBoardType, PortfolioKeyword, PortfolioVisibility } from "./portfolio-api";

export type PortfolioAttachmentType = "IMAGE" | "FILE";

export type PortfolioAttachment = {
  attachmentId: number;
  attachmentType: PortfolioAttachmentType;
  originalFilename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  displayOrder: number;
  image: boolean;
};

export type PortfolioDetail = {
  postId: number;
  userId: number;
  boardType: PortfolioBoardType;
  title: string;
  content: string;
  description: string;
  videoLink: string | null;
  githubLink: string | null;
  visibility: PortfolioVisibility;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  thumbnailImage: string | null;
  liked: boolean | null;
  keywords: PortfolioKeyword[];
  images: PortfolioAttachment[];
  files: PortfolioAttachment[];
};

export const getPortfolioDetail = async (
  boardType: PortfolioBoardType,
  postId: number,
): Promise<PortfolioDetail> => {
  // 공개 조회: 비로그인도 접근 가능 (로그인 시 liked 등 개인화 정보 포함)
  return backendJson<PortfolioDetail>(`/api/posts/${boardType}/${postId}`, {
    requiresAuth: false,
  });
};
