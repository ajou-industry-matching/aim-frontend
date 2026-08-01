// src/screens/notice-create/index.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input/input";
import { FileTextAltIcon, UploadIcon } from "@/shared/ui/icons/index";
import { Footer } from "@/shared/ui/footer/footer";
import { createNotice } from "@/api/notice";

export function NoticeCreateScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // 파일 삭제 핸들러
  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 등록 로직 핸들러
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !content.trim()) {
      alert("모든 필수 항목(*)을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createNotice({ title, description, content }, files);

      alert("공지사항이 성공적으로 등록되었습니다.");
      router.push("/notice");
      router.refresh();
    } catch (error) {
      console.error("🚨 공지 등록 실패 상세 원인:", error);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pt-[160px] pb-[100px] md:px-12 xl:px-24 2xl:px-0">
        {/* 1. 타이틀 영역 */}
        <div className="mb-12 border-b border-gray-900 pb-6">
          <h1 className="text-[40px] font-bold text-gray-900">공지사항 작성</h1>
          <p className="mt-2 text-[15px] text-gray-500">중요한 공지사항을 작성하고 공유하세요</p>
        </div>

        {/* 2. 기본 정보 섹션 */}
        <section className="mb-12 flex flex-col gap-6">
          <h2 className="text-[20px] font-bold text-gray-900">기본 정보</h2>

          <div className="flex flex-col gap-2">
            <label className="text-[15px] font-medium text-gray-700">제목 *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
            />
          </div>

          {/* 간단한 소개 */}
          <div className="flex flex-col gap-2">
            <label className="text-[15px] font-medium text-gray-700">간단한 소개 *</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="목록에 노출될 간단한 소개글을 입력하세요"
            />
          </div>
        </section>

        {/* 공지 내용 섹션 */}
        <section className="mb-12 flex flex-col gap-6">
          <h2 className="text-[20px] font-bold text-gray-900">공지 내용</h2>
          <div className="flex flex-col gap-2">
            <label className="text-[15px] font-medium text-gray-700">내용 *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지사항 상세 내용을 입력하세요"
              className="min-h-[400px] w-full rounded-md border border-gray-300 p-4 text-[15px] text-gray-800 outline-none focus:border-gray-900"
            />
          </div>
        </section>

        {/* 파일 첨부 섹션 */}
        <section className="mb-12 flex flex-col gap-6">
          <h2 className="text-[20px] font-bold text-gray-900">파일 첨부</h2>
          <div className="flex flex-col gap-4">
            <label className="text-[15px] font-medium text-gray-700">첨부파일</label>

            {/* input 태그 */}
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
            >
              <UploadIcon className="mb-2 h-8 w-8 text-gray-400" />
              <span className="font-medium text-gray-700">파일 추가</span>
              <span className="mt-1 text-sm text-gray-500">PDF, DOCX, PPTX, ZIP, 이미지 등</span>
            </div>

            {/* 파일목록 렌더링 */}
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-md border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <FileTextAltIcon className="h-6 w-6 text-gray-400" />
                  <span className="font-medium text-gray-700">{file.name}</span>
                  <span className="text-sm text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="px-1 text-lg font-medium text-gray-400 transition-colors hover:text-gray-900"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 버튼 영역 */}
        <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-8">
          <Button
            variant="secondary"
            size="large"
            onClick={() => router.back()}
            className="w-[120px]"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            className="w-[120px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
