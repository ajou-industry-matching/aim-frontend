// src/screens/notice-detail/index.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button/button";
import { Footer } from "@/shared/ui/footer/footer";
import { RichEditor } from "@/shared/ui/rich-editor";
import type { Notice } from "@/api/notice";

interface NoticeDetailScreenProps {
  notice: Notice;
}

export function NoticeDetailScreen({ notice }: NoticeDetailScreenProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}.`;
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <>
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-[40px] pt-[160px] pb-[100px]">
        {/* 타이틀 영역 */}
        <h1 className="mb-[20px] text-center text-[40px] font-bold leading-[1.3] tracking-[-0.025em] text-gray-900">
          공지사항
        </h1>

        {/* 상세 내용 테이블 영역 */}
        <div className="w-full text-[15px] text-gray-800">
          <div className="flex min-h-[48px] items-center justify-center gap-[10px] border-b border-t-2 border-b-gray-200 border-t-gray-200 bg-gray-50 px-5 py-3">
            <span className="text-center font-semibold">{notice.title}</span>
          </div>

          <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200">
            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-r border-gray-200 bg-gray-50 px-5 py-3 font-medium text-gray-700 md:w-[180px] md:border-b-0">
              작성일
            </div>
            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-gray-200 px-5 py-3 md:w-[540px] md:border-b-0">
              {formatDate(notice.createdAt)}
            </div>

            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-l border-r border-gray-200 bg-gray-50 px-5 py-3 font-medium text-gray-700 md:w-[180px] md:border-b-0 md:border-l-0">
              작성자
            </div>
            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] px-5 py-3 md:w-[540px]">
              {notice.userId ? `회원(ID: ${notice.userId})` : "관리자"}
            </div>
          </div>

          {/* 본문 내용 영역 */}
          <div className="flex flex-col min-h-[576px] w-full border-b border-gray-200 py-6 px-5 gap-[10px] leading-relaxed text-[16px] text-gray-800">
            {notice.images && notice.images.length > 0 && (
              <div className="flex flex-col gap-4 mb-4">
                {notice.images.map((img) => (
                  <img
                    key={img.attachmentId}
                    src={img.filePath}
                    alt={img.originalFilename || "본문 첨부 이미지"}
                    className="max-w-full md:max-w-[400px] h-auto rounded-md object-contain" // 첨부 이미지 크기 조절 필요
                  />
                ))}
              </div>
            )}

            {/* 본문은 리치 에디터로 작성된 HTML이므로 동일한 에디터로 읽기 전용 렌더한다.
                (포트폴리오 상세와 같은 방식 — 평문으로 출력하면 태그가 그대로 보인다) */}
            <RichEditor content={notice.content} isEditable={false} />
          </div>

          {/* 파일 첨부 영역 */}
          <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200">
            <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-r border-gray-200 bg-gray-50 px-5 py-3 font-medium text-gray-700 md:w-[180px] md:border-b-0">
              파일첨부
            </div>

            {/* 첨부파일 리스트 영역 */}
            <div className="flex min-h-[48px] flex-1 flex-col justify-center gap-2 px-5 py-3">
              {notice.files && notice.files.length > 0 ? (
                notice.files.map((file) => (
                  <a
                    key={file.attachmentId}
                    href={file.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:underline w-fit"
                  >
                    <span className="font-medium">{file.originalFilename}</span>
                    {/* 파일 크기 표기 */}
                    <span className="text-xs text-gray-400">({formatFileSize(file.fileSize)})</span>
                  </a>
                ))
              ) : (
                <span className="text-[14px] text-gray-500">첨부파일이 없습니다.</span>
              )}
            </div>
          </div>
        </div>

        {/* 목록 돌아가기 버튼 */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="large"
            className="w-[150px]"
            onClick={() => router.push("/notice")}
          >
            목록
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
