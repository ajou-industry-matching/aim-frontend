// src/screens/notice-detail/index.tsx
"use client";

import { useRouter } from "next/navigation";
import { Footer } from "@/shared/ui/footer";
import { Button } from "@/shared/ui/button/button"; // 공통 버튼 컴포넌트 임포트
import type { Notice } from "@/api/notice";

interface NoticeDetailScreenProps {
  notice: Notice;
}

export function NoticeDetailScreen({ notice }: NoticeDetailScreenProps) {
  const router = useRouter();

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}.`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 메인 레이아웃 (width: 1440, top: 160, gap: 40) */}
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-[40px] px-4 pt-[160px] pb-[100px]">
        {/* 타이틀 영역 (height: 52, font-size: 40px, line-height: 130%, tracking: -2.5%) */}
        <h1 className="text-center text-[40px] font-bold leading-[1.3] tracking-[-0.025em] text-gray-900">
          공지사항
        </h1>

        {/* 상세 내용 테이블 영역 */}
        <div className="w-full text-[15px] text-gray-800">
          {/* 1. 공지 제목 영역 (border-top: 2px, border-bottom: 1px, 배경 회색, 가운데 정렬) */}
          <div className="flex min-h-[48px] items-center justify-center gap-[10px] border-b border-t-2 border-b-gray-200 border-t-gray-900 bg-gray-50 px-5 py-3">
            <span className="text-center font-semibold">{notice.title}</span>
          </div>

          {/* 2. 작성일 / 작성자 영역 (180 + 540 + 180 + 540 = 1440) */}
          <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200">
            {/* 작성자 라벨 */}
            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-r border-gray-200 bg-gray-50 px-5 py-3 font-medium text-gray-700 md:w-[180px] md:border-b-0">
              작성자
            </div>
            {/* 작성자 데이터 */}
            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-gray-200 px-5 py-3 md:w-[540px] md:border-b-0">
              {/* API 명세의 userId나 실제 이름 데이터로 매핑 */}
              관리자
            </div>

            {/* 작성일 라벨 */}
            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-l border-r border-gray-200 bg-gray-50 px-5 py-3 font-medium text-gray-700 md:w-[180px] md:border-b-0 md:border-l-0">
              작성일
            </div>
            {/* 작성일 데이터 */}
            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] px-5 py-3 md:w-[540px]">
              {formatDate(notice.createdAt)}
            </div>
          </div>

          {/* 3. 본문 내용 영역 (height: 576, border-bottom: 1px) */}
          {/* 텍스트 줄바꿈 보존을 위해 whitespace-pre-wrap 사용 */}
          <div className="min-h-[576px] w-full border-b border-gray-200 py-6 px-5 gap-[10px] whitespace-pre-wrap leading-relaxed">
            {notice.description}
          </div>

          {/* 4. 파일 첨부 영역 (180 + 1260) */}
          <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200">
            {/* 첨부 라벨 */}
            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-r border-gray-200 bg-gray-50 px-5 py-3 font-medium text-gray-700 md:w-[180px] md:border-b-0">
              첨부파일
            </div>
            {/* 파일 링크 영역 */}
            <div className="flex min-h-[48px] flex-1 items-center gap-[10px] px-5 py-3">
              <a href="#" className="text-gray-500 hover:text-gray-900 hover:underline">
                {/* 추후 실제 첨부파일 데이터로 교체 */}
                첨부파일이 없습니다.
              </a>
            </div>
          </div>
        </div>

        {/* 목록 돌아가기 버튼 (Figma 레이아웃 하단) */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="secondary"
            size="large" // 공통 컴포넌트의 사이즈 설정에 맞게 조정하세요
            onClick={() => router.push("/notice")}
            className="w-[120px]"
          >
            목록
          </Button>
        </div>
      </main>

      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}
