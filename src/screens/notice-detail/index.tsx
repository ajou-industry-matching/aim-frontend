// src/screens/notice-detail/index.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button/button";
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
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-[40px] px-4 pt-[160px] pb-[100px]">
      {/* 타이틀 영역 */}
      <h1 className="text-center text-[40px] font-bold leading-[1.3] tracking-[-0.025em] text-gray-900">
        공지사항
      </h1>

      {/* 상세 내용 테이블 영역 */}
      <div className="w-full text-[15px] text-gray-800">
        <div className="flex min-h-[48px] items-center justify-center gap-[10px] border-b border-t-2 border-b-gray-200 border-t-gray-900 bg-gray-50 px-5 py-3">
          <span className="text-center font-semibold">{notice.title}</span>
        </div>

        <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200">
          <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-r border-gray-200 bg-gray-50 px-5 py-3 font-medium text-gray-700 md:w-[180px] md:border-b-0">
            작성자
          </div>
          <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-gray-200 px-5 py-3 md:w-[540px] md:border-b-0">
            {notice.userId ? `회원(ID: ${notice.userId})` : "관리자"}
          </div>

          <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-l border-r border-gray-200 bg-gray-50 px-5 py-3 font-medium text-gray-700 md:w-[180px] md:border-b-0 md:border-l-0">
            작성일
          </div>
          <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] px-5 py-3 md:w-[540px]">
            {formatDate(notice.createdAt)}
          </div>
        </div>

        {/* 본문 내용 영역 */}
        <div className="flex flex-col min-h-[576px] w-full border-b border-gray-200 py-6 px-5 gap-[10px] whitespace-pre-wrap leading-relaxed text-[16px] text-gray-800">
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

          {/* 실제 텍스트 본문 */}
          <div>{notice.content}</div>
        </div>

        {/* 파일 첨부 영역 */}
        <div className="flex flex-wrap md:flex-nowrap border-b border-gray-200">
          <div className="flex min-h-[48px] w-full shrink-0 items-center gap-[10px] border-b border-r border-gray-200 bg-gray-50 px-5 py-3 font-medium text-gray-700 md:w-[180px] md:border-b-0">
            첨부파일
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
      <div className="mt-8 flex justify-center">
        <Button
          variant="secondary"
          size="large"
          onClick={() => router.push("/notice")}
          className="w-[120px]"
        >
          목록
        </Button>
      </div>
    </main>
  );
}
