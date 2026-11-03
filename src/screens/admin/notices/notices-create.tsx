"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input/input";
import {
  FileUploader,
  FileListItem,
  POST_ATTACHMENT_LIMITS,
  formatFileSize,
  validateFiles,
} from "@/shared/ui/file-uploader/file-uploader";
import { createPost } from "@/api/posts";
import { RichEditor, isRichTextEmpty } from "@/shared/ui/rich-editor";
import { clearListCache } from "@/api/cache";

export function AdminNoticeCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const filesTotalBytes = files.reduce((sum, file) => sum + file.size, 0);

  // 파일 삭제 핸들러
  const handleRemoveFile = (indexToRemove: number) => {
    setAttachmentError(null);
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 등록 로직 핸들러
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || isRichTextEmpty(content)) {
      alert("모든 필수 항목(*)을 입력해주세요.");
      return;
    }

    const request = { title, description, content };
    const validationError = validateFiles(files, POST_ATTACHMENT_LIMITS, {
      requestBytes: new Blob([JSON.stringify(request)]).size,
    });
    if (validationError) {
      setAttachmentError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      await createPost("NOTICE", request, { files });
      clearListCache(); // 캐시 지우기 (관리자 목록 갱신 위해)

      alert("공지사항이 성공적으로 등록되었습니다.");
      router.push("/admin/notices");
      router.refresh();
    } catch {
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pt-12 pb-[100px] md:px-12 xl:px-24 2xl:px-8">
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
          <RichEditor
            content={content}
            onChange={(html) => setContent(html)}
            placeholder="공지 내용을 입력하세요"
            className="min-h-[400px]"
          />
        </div>
      </section>

      {/* 파일 첨부 섹션 */}
      <section className="mb-12 flex flex-col gap-6">
        <h2 className="text-[20px] font-bold text-gray-900">파일 첨부</h2>
        <div className="flex flex-col gap-4">
          <label className="text-[15px] font-medium text-gray-700">첨부파일</label>

          <FileUploader
            multiple
            {...POST_ATTACHMENT_LIMITS}
            currentCount={files.length}
            currentTotalBytes={filesTotalBytes}
            onFileSelect={(selected) => {
              setAttachmentError(null);
              setFiles((prev) => [...prev, ...selected]);
            }}
          />

          {attachmentError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-[14px] whitespace-pre-line text-red-600"
            >
              {attachmentError}
            </p>
          )}

          {files.map((file, index) => (
            <FileListItem
              key={`${file.name}-${index}`}
              file={{
                id: String(index),
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type,
              }}
              onRemove={() => handleRemoveFile(index)}
            />
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
    </div>
  );
}
