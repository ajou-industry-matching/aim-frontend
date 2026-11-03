import { backendJson } from "@/api/client";
import type { PostDetail } from "@/api/posts";

export type CrawledProject = {
  crawledProjectId: number;
  title: string;
  summary: string | null;
  representativeImage: string | null;
  /** 소프트콘 분류 코드(S, I, ...). 다른 출처는 라벨 문자열이 올 수 있다. */
  category: string | null;
  /** 이미 가져왔으면 만들어진 포트폴리오 글 ID */
  portfolioPostId: number | null;
};

// 가져오면 portfolioPostId가 바뀌므로 캐시하지 않는다.
export const getMyCrawledProjects = (): Promise<CrawledProject[]> =>
  backendJson<CrawledProject[]>("/api/crawled-projects/my");

// 이미 가져온 프로젝트면 백엔드가 새로 만들지 않고 기존 글을 돌려준다.
export const importCrawledProject = (projectId: number): Promise<PostDetail> =>
  backendJson<PostDetail>(`/api/crawled-projects/${projectId}/portfolio`, { method: "POST" });
