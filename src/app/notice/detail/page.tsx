// src/app/notice/detail/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NoticeDetailScreen } from "@/screens/notice-detail";
import { getNoticeById, type Notice } from "@/api/notice";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";

function NoticeDetailWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get("id");
  const noticeId = idParam ? Number(idParam) : null;

  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!noticeId) {
      setIsLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getNoticeById(noticeId);
        setNotice(data);
      } catch (err) {
        console.error("공지사항 상세 로딩 실패:", err);
        setError(err instanceof Error ? err : new Error("데이터를 불러오지 못했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [noticeId]);

  // 로딩 중 화면
  if (isLoading) {
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center pt-[160px]">
        <span className="text-[15px] text-gray-500">공지사항을 불러오는 중입니다...</span>
      </div>
    );
  }

  // 예외 처리
  if (error || !notice || !noticeId) {
    return (
      <div className="pt-[160px] pb-[80px]">
        <EmptyState
          variant="no-results"
          title="공지사항을 찾을 수 없습니다"
          description="존재하지 않거나 삭제된 공지사항입니다."
          primaryAction={{
            label: "목록으로 돌아가기",
            onClick: () => router.push("/notice"),
          }}
        />
      </div>
    );
  }

  return <NoticeDetailScreen notice={notice} />;
}

export default function NoticeDetailRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NoticeDetailWrapper />
    </Suspense>
  );
}
