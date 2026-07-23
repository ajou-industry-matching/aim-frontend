"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BackendApiError } from "@/api/client";
import { clearListCache } from "@/api/cache";
import { createPost, deletePost, getPostDetail, updatePost } from "@/api/posts";
import type { PortfolioAttachment } from "@/api/posts";

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const FileIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const XIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type Props = { id: string };

export const AdminNoticesEditPage = ({ id }: Props) => {
  const router = useRouter();
  const isCreateMode = id === "new";
  const postId = isCreateMode ? null : Number(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("관리자");
  const [existingFiles, setExistingFiles] = useState<PortfolioAttachment[]>([]);
  const [deleteAttachmentIds, setDeleteAttachmentIds] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(!isCreateMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (postId === null || Number.isNaN(postId)) return;

    let isMounted = true;

    const fetchDetail = async () => {
      try {
        const detail = await getPostDetail("NOTICE", postId);
        if (!isMounted) return;
        setTitle(detail.title);
        setContent(detail.content ?? "");
        if (detail.authorName) setAuthorName(detail.authorName);
        setExistingFiles([...detail.files, ...detail.images]);
      } catch (fetchError) {
        console.error("[admin] 공지사항 상세 조회 실패", fetchError);
        if (isMounted) setError("공지사항을 불러오지 못했습니다.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const getErrorMessage = (submitError: unknown): string =>
    submitError instanceof BackendApiError
      ? submitError.message
      : "요청 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";

  const removeExistingFile = (attachmentId: number) => {
    setExistingFiles((files) => files.filter((file) => file.attachmentId !== attachmentId));
    setDeleteAttachmentIds((ids) => [...ids, attachmentId]);
  };

  const handleNewFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length > 0) setNewFiles((files) => [...files, ...selected]);
    event.target.value = "";
  };

  const removeNewFile = (index: number) => {
    setNewFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("제목을 입력해주세요.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const request = { title: trimmedTitle, content, visibility: "PUBLIC" as const };
      if (isCreateMode) {
        await createPost("NOTICE", request, { files: newFiles });
      } else if (postId !== null) {
        await updatePost(
          "NOTICE",
          postId,
          { ...request, deleteAttachmentIds },
          { files: newFiles },
        );
      }
      clearListCache();
      router.push("/admin/notices");
    } catch (submitError) {
      console.error("[admin] 공지사항 저장 실패", submitError);
      setError(getErrorMessage(submitError));
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (postId === null) return;
    if (!window.confirm("공지사항을 삭제하시겠습니까?")) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await deletePost("NOTICE", postId);
      clearListCache();
      router.push("/admin/notices");
    } catch (deleteError) {
      console.error("[admin] 공지사항 삭제 실패", deleteError);
      setError(getErrorMessage(deleteError));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/notices")}
            className="mb-3 flex items-center gap-1 text-[14px] text-[#666] transition-colors hover:text-[#111]"
          >
            <BackIcon />
            목록으로
          </button>
          <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-1px] text-[#111]">
            {isCreateMode ? "공지사항 작성" : "공지사항 수정"}
          </h1>
          <p className="mt-2 text-[16px] leading-[1.5] tracking-[-0.4px] text-[#666]">
            {isCreateMode ? "새 공지사항을 작성하세요." : "공지사항을 수정하세요."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || isLoading}
            className="h-10 px-6 py-2.5 rounded-lg bg-[#004a9c] text-white text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-[#003d8a] disabled:cursor-not-allowed disabled:bg-[#b3b3b3]"
          >
            {isCreateMode ? "등록" : "수정"}
          </button>
          {!isCreateMode && (
            <button
              onClick={() => void handleDelete()}
              disabled={isSubmitting || isLoading}
              className="h-10 px-6 py-2.5 border border-red-500 rounded-lg text-red-500 text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-[14px] text-red-600">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="py-16 text-center text-[14px] text-[#999]">불러오는 중...</p>
      ) : (
        <>
          {/* 기본 정보 */}
          <section className="mb-8">
            <h2 className="mb-6 text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
              기본 정보
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#333]">제목 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="공지사항 제목을 입력하세요"
                  className="h-10 w-full rounded-sm border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#333] placeholder-[#999] outline-none focus:border-[#004a9c]"
                />
              </div>
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#333]">작성자</label>
                <input
                  type="text"
                  value={authorName}
                  disabled
                  className="h-10 w-full rounded-sm border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
                />
              </div>
            </div>
          </section>

          {/* 공지 내용 */}
          <section className="mb-8">
            <h2 className="mb-6 text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
              공지 내용
            </h2>
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#333]">내용 *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="공지 내용을 입력하세요"
                className="min-h-75 w-full resize-y rounded-sm border border-[#e5e5e5] bg-white p-4 text-[14px] text-[#333] placeholder-[#999] outline-none focus:border-[#004a9c]"
              />
            </div>
          </section>

          {/* 파일 첨부 */}
          <section>
            <h2 className="mb-6 text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
              파일 첨부
            </h2>
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#333]">첨부파일</label>
              <div className="flex flex-col gap-2">
                {existingFiles.map((file) => (
                  <div
                    key={file.attachmentId}
                    className="flex w-full items-center gap-3 rounded-lg border border-[#e5e5e5] bg-white p-3"
                  >
                    <span className="text-[#666]">
                      <FileIcon />
                    </span>
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-[#333]">{file.originalFilename}</p>
                      <p className="text-[12px] text-[#999]">{formatFileSize(file.fileSize)}</p>
                    </div>
                    <button
                      onClick={() => removeExistingFile(file.attachmentId)}
                      aria-label={`${file.originalFilename} 삭제`}
                      className="text-[#999] transition-colors hover:text-red-500"
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}
                {newFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex w-full items-center gap-3 rounded-lg border border-dashed border-[#004a9c]/40 bg-[#f8fafd] p-3"
                  >
                    <span className="text-[#004a9c]">
                      <FileIcon />
                    </span>
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-[#333]">{file.name}</p>
                      <p className="text-[12px] text-[#999]">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeNewFile(index)}
                      aria-label={`${file.name} 삭제`}
                      className="text-[#999] transition-colors hover:text-red-500"
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleNewFilesChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-10 w-fit items-center gap-2 rounded-lg border border-[#e5e5e5] px-4 text-[14px] font-medium text-[#333] transition-colors hover:bg-[#f9f9f9]"
                >
                  <FileIcon />
                  파일 추가
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
