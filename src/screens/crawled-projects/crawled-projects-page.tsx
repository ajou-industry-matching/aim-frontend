"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthReady } from "@/lib/auth";
import { getMyCrawledProjects, type CrawledProjectResponse } from "@/api/crawled-projects";
import { Card } from "@/shared/ui/card/card";
import { Footer } from "@/shared/ui/footer";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";

export const CrawledProjectsPage = () => {
  const router = useRouter();
  const { isReady: isAuthReady, isAuthenticated } = useAuthReady();
  const [projects, setProjects] = useState<CrawledProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthReady, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isCancelled = false;

    getMyCrawledProjects()
      .then((data) => {
        if (!isCancelled) {
          setProjects(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("크롤링 프로젝트 로딩 실패:", err);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthReady || isLoading) {
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center pt-[160px]">
        <span className="text-[15px] text-gray-500">불러오는 중입니다...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="mx-auto flex-1 w-full max-w-[1440px] px-4 pt-[160px] pb-[100px]">
        <h1 className="mb-12 text-center text-[40px] font-bold leading-[1.3] tracking-[-0.025em] text-gray-900">
          내 크롤링 프로젝트
        </h1>

        {projects.length === 0 ? (
          <EmptyState
            variant="no-content"
            title="참여한 크롤링 프로젝트가 없어요"
            description="외부에서 수집된 프로젝트가 없습니다."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.crawledProjectId}
                variant="post"
                href={`/crawled-projects/detail?id=${project.crawledProjectId}`}
                thumbnail={project.representativeImage ?? undefined}
                tags={project.category ? [project.category] : []}
                title={project.title}
                description={project.summary || project.description || ""}
                author={{ name: project.sourceUid || "AIM" }}
                date={project.createdAt.split("T")[0].replace(/-/g, ".")}
                stats={{ likes: 0, comments: 0, views: 0 }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
