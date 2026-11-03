"use client";

import { useEffect, useState } from "react";
import { clearListCache } from "@/api/cache";
import {
  getMyCrawledProjects,
  importCrawledProject,
  type CrawledProject,
} from "@/api/crawled-projects";

export type UseMyCrawledProjectsResult = {
  projects: CrawledProject[];
  isLoading: boolean;
  loadError: string | null;
  /** 가져오는 중인 프로젝트 ID */
  importingId: number | null;
  importError: string | null;
  importProject: (projectId: number) => Promise<void>;
};

export const useMyCrawledProjects = (): UseMyCrawledProjectsResult => {
  const [projects, setProjects] = useState<CrawledProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    getMyCrawledProjects()
      .then((data) => {
        if (!isCancelled) setProjects(data);
      })
      .catch((cause: unknown) => {
        console.error("크롤링 프로젝트를 불러오지 못했습니다.", cause);
        if (!isCancelled)
          setLoadError("프로젝트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const importProject = async (projectId: number) => {
    setImportingId(projectId);
    setImportError(null);

    try {
      const post = await importCrawledProject(projectId);
      setProjects((current) =>
        current.map((project) =>
          project.crawledProjectId === projectId
            ? { ...project, portfolioPostId: post.postId }
            : project,
        ),
      );
      // 내 프로필·포트폴리오 목록에 새 글이 보이도록 한다.
      clearListCache();
    } catch (cause) {
      console.error("크롤링 프로젝트를 가져오지 못했습니다.", cause);
      setImportError("가져오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setImportingId(null);
    }
  };

  return { projects, isLoading, loadError, importingId, importError, importProject };
};
