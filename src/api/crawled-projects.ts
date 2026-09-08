import { backendJson } from "@/api/client";
import { type PostDetail } from "@/api/posts";

export interface CrawledProjectMember {
  role: string;
  name: string;
  maskedEmail: string;
  department: string;
  grade: string;
}

export interface CrawledProjectResponse {
  crawledProjectId: number;
  sourceUid: string | null;
  term: string | null;
  title: string;
  summary: string | null;
  description: string | null;
  content: string;
  sourceUrl: string | null;
  presentationUrl: string | null;
  videoUrl: string | null;
  githubUrl: string | null;
  representativeImage: string | null;
  category: string | null;
  members: CrawledProjectMember[];
  createdAt: string;
}

export async function getMyCrawledProjects(): Promise<CrawledProjectResponse[]> {
  return backendJson<CrawledProjectResponse[]>("/api/crawled-projects/my", {
    method: "GET",
    requiresAuth: true,
  });
}

export async function getCrawledProjectDetail(id: number): Promise<CrawledProjectResponse> {
  return backendJson<CrawledProjectResponse>(`/api/crawled-projects/${id}`, {
    method: "GET",
    requiresAuth: true,
  });
}

export async function cloneCrawledProjectToPortfolio(id: number): Promise<PostDetail> {
  return backendJson<PostDetail>(`/api/crawled-projects/${id}/portfolio`, {
    method: "POST",
    requiresAuth: true,
  });
}
