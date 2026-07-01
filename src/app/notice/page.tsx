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
  // URL에서 page 번호를 가져옵니다. 값이 없거나 이상하면 무조건 1페이지로 처리합니다.
  const currentPage = Number(searchParams.page) || 1;

  // API 호출 시 (아직 백엔드 페이징이 안 되어 있더라도) 형식상 페이지 번호를 넘깁니다.
  const noticesData = await getNotices();

  // 더미 총 페이지 수
  const dummyTotalPages = 9;

  return (
    // Props를 모두 전달
    <NoticeScreen notices={noticesData} currentPage={currentPage} totalPages={dummyTotalPages} />
  );
}
