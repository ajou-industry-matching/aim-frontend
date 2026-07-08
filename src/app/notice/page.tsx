// src/app/notice/page.tsx
import { Metadata } from "next";
import { NoticeScreen } from "@/screens/notice";
import { getNotices } from "@/api/notice";

// SEO를 위한 메타데이터 설정
export const metadata: Metadata = {
  title: "공지사항 | AIM AJOU",
  description: "AIM AJOU 프로젝트의 새로운 소식과 공지사항을 확인하세요.",
};

export default async function NoticeRoute({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;

  const { notices, totalPages } = await getNotices(currentPage);

  return <NoticeScreen notices={notices} currentPage={currentPage} totalPages={totalPages} />;
}
