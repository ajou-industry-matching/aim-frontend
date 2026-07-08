// src/app/notice/[id]/page.tsx
import { notFound } from "next/navigation";
import { NoticeDetailScreen } from "@/screens/notice-detail";
import { getNoticeById, getNotices } from "@/api/notice";

export async function generateStaticParams() {
  const { notices } = await getNotices(1, 100);
  return notices.map((notice) => ({
    id: notice.postId.toString(),
  }));
}

export default async function NoticeDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const noticeId = Number(resolvedParams.id);

  let noticeData;

  try {
    noticeData = await getNoticeById(noticeId);
  } catch {
    // 통신 에러
  }

  if (!noticeData) {
    notFound();
  }

  return <NoticeDetailScreen notice={noticeData} />;
}
