import { backendJson } from "@/api/client";
import type { PortfolioKeyword } from "@/api/posts";

export const createKeyword = (keywordName: string): Promise<PortfolioKeyword> =>
  backendJson<PortfolioKeyword>("/api/admin/keywords", {
    method: "POST",
    json: { keywordName },
  });

export const updateKeyword = (keywordId: number, keywordName: string): Promise<PortfolioKeyword> =>
  backendJson<PortfolioKeyword>(`/api/admin/keywords/${keywordId}`, {
    method: "PATCH",
    json: { keywordName },
  });

export const deleteKeyword = (keywordId: number): Promise<{ keywordId: number }> =>
  backendJson<{ keywordId: number }>(`/api/admin/keywords/${keywordId}`, { method: "DELETE" });
