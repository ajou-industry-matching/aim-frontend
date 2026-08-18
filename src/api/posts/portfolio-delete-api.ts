import { backendJson } from "@/api/client";
import type { PortfolioBoardType } from "./portfolio-api";

// DELETE /api/posts/{boardType}/{postId} — 게시글 삭제 (로그인 필요)
export const deletePortfolio = async (
  boardType: PortfolioBoardType,
  postId: number,
): Promise<void> => {
  await backendJson(`/api/posts/${boardType}/${postId}`, { method: "DELETE" });
};
