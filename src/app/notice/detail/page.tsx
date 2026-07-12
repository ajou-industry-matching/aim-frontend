// src/app/notice/detail/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NoticeDetailScreen } from "@/screens/notice-detail";
// 💡 서버용 API(getServerNoticeById) 대신 클라이언트용 API(getNoticeById)를 사용합니다.
import { getNoticeById, type Notice } from "@/api/notice";
// 💡 경로에 맞게 EmptyState 컴포넌트를 불러와주세요
import { EmptyState } from "@/shared/ui/empty-states/empty-states";

function NoticeDetailWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 ?id= 값을 가져옵니다.
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

  // 1. 로딩 중 화면
  if (isLoading) {
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center pt-[160px]">
        <span className="text-[15px] text-gray-500">공지사항을 불러오는 중입니다...</span>
      </div>
    );
  }

  // 2. 에러가 났거나, id가 없거나, 데이터가 없을 때의 예외 처리
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

  // 3. 정상 렌더링
  return <NoticeDetailScreen notice={notice} />;
}

export default function NoticeDetailRoute() {
  return (
    // useSearchParams를 사용하는 컴포넌트는 반드시 Suspense로 감싸주어야 빌드 에러가 나지 않습니다.
    <Suspense fallback={<div>Loading...</div>}>
      <NoticeDetailWrapper />
    </Suspense>
  );
}
