"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearListCache } from "@/api/cache";
import { deletePost, getPostDetail, updatePost } from "@/api/posts";
import type { PortfolioAttachment } from "@/api/posts";

// 💡 1. 새로 추가된 공용 컴포넌트 Import
import { RichEditor } from "@/shared/ui/rich-editor";
import { FileUploader, FileListItem } from "@/shared/ui/file-uploader/file-uploader";

// 💡 2. FileIcon, XIcon 등은 FileListItem에서 자체 제공하므로 상단 아이콘 선언부 삭제 (BackIcon은 헤더에서 쓰므로 유지)
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

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type Props = { id: string };

export const AdminNoticesEditPage = ({ id }: Props) => {
  const router = useRouter();
  const postId = Number(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("관리자");
  const [existingFiles, setExistingFiles] = useState<PortfolioAttachment[]>([]);
  const [deleteAttachmentIds, setDeleteAttachmentIds] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 💡 3. FileUploader가 자체적으로 input을 처리하므로 fileInputRef 상태 제거

  useEffect(() => {
    if (Number.isNaN(postId)) return;

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

  const removeExistingFile = (attachmentId: number) => {
    setExistingFiles((files) => files.filter((file) => file.attachmentId !== attachmentId));
    setDeleteAttachmentIds((ids) => [...ids, attachmentId]);
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

    // 💡 4. (참고) 에디터를 쓸 경우 빈 값인지 검사할 때 HTML 태그를 제거하고 체크하는 것이 좋습니다.
    if (!content.replace(/<[^>]*>/g, "").trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const request = { title: trimmedTitle, content, visibility: "PUBLIC" as const };
      await updatePost("NOTICE", postId, { ...request, deleteAttachmentIds }, { files: newFiles });
      clearListCache();
      router.push("/admin/notices");
    } catch (submitError) {
      console.error("[admin] 공지사항 저장 실패", submitError);
      setError("요청 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (Number.isNaN(postId)) return;
    if (!window.confirm("공지사항을 삭제하시겠습니까?")) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await deletePost("NOTICE", postId);
      clearListCache();
      router.push("/admin/notices");
    } catch (deleteError) {
      console.error("[admin] 공지사항 삭제 실패", deleteError);
      setError("요청 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header (원본 유지) */}
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
            공지사항 수정
          </h1>
          <p className="mt-2 text-[16px] leading-normal tracking-[-0.4px] text-[#666]">
            공지사항을 수정하세요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || isLoading}
            className="h-10 px-6 py-2.5 rounded-lg bg-[#004a9c] text-white text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-[#003d8a] disabled:cursor-not-allowed disabled:bg-[#b3b3b3]"
          >
            수정
          </button>
          <button
            onClick={() => void handleDelete()}
            disabled={isSubmitting || isLoading}
            className="h-10 px-6 py-2.5 border border-red-500 rounded-lg text-red-500 text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            삭제
          </button>
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

          {/* 💡 5. 공지 내용: textarea -> RichEditor 로 교체 완료 */}
          <section className="mb-8">
            <h2 className="mb-6 text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
              공지 내용
            </h2>
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#333]">내용 *</label>
              <RichEditor
                content={content}
                onChange={(html) => setContent(html)}
                placeholder="공지 내용을 입력하세요"
                className="min-h-[400px]"
              />
            </div>
          </section>

          {/* 💡 6. 파일 첨부: 직접 만든 UI -> 공용 FileUploader & FileListItem 으로 교체 완료 */}
          <section>
            <h2 className="mb-6 text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
              파일 첨부
            </h2>
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#333]">
                첨부파일 (최대 5개, 각 20MB 이하)
              </label>
              <div className="flex flex-col gap-4 mt-2">
                <FileUploader
                  multiple
                  onFileSelect={(selected) => setNewFiles((prev) => [...prev, ...selected])}
                />

                {(existingFiles.length > 0 || newFiles.length > 0) && (
                  <div className="flex flex-col gap-2">
                    {/* 서버에 이미 올라가 있는 기존 파일 렌더링 */}
                    {existingFiles.map((file) => (
                      <FileListItem
                        key={`existing-file-${file.attachmentId}`}
                        file={{
                          id: `existing-${file.attachmentId}`,
                          name: file.originalFilename,
                          size: formatFileSize(file.fileSize),
                          type: file.fileType || "",
                        }}
                        onRemove={() => removeExistingFile(file.attachmentId)}
                      />
                    ))}
                    {/* 이번에 새로 업로드 할 파일 렌더링 */}
                    {newFiles.map((file, index) => (
                      <FileListItem
                        key={`${file.name}-${index}`}
                        file={{
                          id: String(index),
                          name: file.name,
                          size: formatFileSize(file.size),
                          type: file.type,
                        }}
                        onRemove={() => removeNewFile(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
