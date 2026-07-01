// src/app/notice/[id]/page.tsx
import { NoticeDetailScreen } from "@/screens/notice-detail";
import { getNotices } from "@/api/notice";
import { notFound } from "next/navigation";

// [추가된 부분] 빌드 시점에 어떤 id 경로들을 정적 HTML로 생성할지 정의합니다.
export async function generateStaticParams() {
  const notices = await getNotices();

  // postId를 문자열로 변환하여 { id: '1' } 형태의 배열로 반환해야 합니다.
  return notices.map((notice) => ({
    id: notice.postId.toString(),
  }));
}

export default async function NoticeDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const noticeId = Number(resolvedParams.id);

  const notices = await getNotices();
  const noticeData = notices.find((notice) => notice.postId === noticeId);

  if (!noticeData) {
    notFound();
  }

  return <NoticeDetailScreen notice={noticeData} />;
}
