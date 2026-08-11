// src/app/notice/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NoticeScreen } from "@/screens/notice";
import { getNotices, type Notice } from "@/api/notice";

import { EmptyState } from "@/shared/ui/empty-states/empty-states";

function NoticeListWrapper() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;

  const [notices, setNotices] = useState<Notice[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getNotices(currentPage);
        setNotices(data.notices);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("공지사항 로딩 실패:", err);
        setError(err instanceof Error ? err : new Error("알 수 없는 오류가 발생했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [currentPage]);

  if (error) {
    return (
      <div className="pt-[160px] pb-[80px]">
        <EmptyState
          variant="error"
          title="데이터를 불러오지 못했습니다"
          description={`문제가 지속되면 관리자에게 문의해 주세요.`}
          primaryAction={{
            label: "다시 시도하기",
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[500px] w-full max-w-[1440px] items-center justify-center pt-[160px]">
        <span className="text-[15px] text-gray-500">목록을 불러오는 중입니다...</span>
      </div>
    );
  }

  // 실제 데이터가 0건일 때
  if (notices.length === 0) {
    return (
      <div className="pt-[160px] pb-[80px]">
        <EmptyState
          variant="no-content"
          title="아직 등록된 공지사항이 없습니다"
          description="새로운 공지사항이 올라오면 이곳에서 확인하실 수 있습니다."
        />
      </div>
    );
  }

  return <NoticeScreen notices={notices} currentPage={currentPage} totalPages={totalPages} />;
}

export default function NoticeRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NoticeListWrapper />
    </Suspense>
  );
}
