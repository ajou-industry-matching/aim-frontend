"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CrawledProjectDetailPage } from "@/screens/crawled-projects-detail";
import { getCrawledProjectDetail, type CrawledProjectResponse } from "@/api/crawled-projects";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";

function CrawledProjectDetailWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get("id");
  const projectId = idParam ? Number(idParam) : null;

  const [project, setProject] = useState<CrawledProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCrawledProjectDetail(projectId);
        setProject(data);
      } catch (err) {
        console.error("크롤링 프로젝트 상세 로딩 실패:", err);
        setError(err instanceof Error ? err : new Error("데이터를 불러오지 못했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center pt-[160px]">
        <span className="text-[15px] text-gray-500">프로젝트를 불러오는 중입니다...</span>
      </div>
    );
  }

  if (error || !project || !projectId) {
    return (
      <div className="pt-[160px] pb-[80px]">
        <EmptyState
          variant="no-results"
          title="프로젝트를 찾을 수 없습니다"
          description="존재하지 않거나 삭제된 프로젝트입니다."
          primaryAction={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/crawled-projects"),
          }}
        />
      </div>
    );
  }

  return <CrawledProjectDetailPage project={project} />;
}

export default function CrawledProjectDetailRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CrawledProjectDetailWrapper />
    </Suspense>
  );
}
