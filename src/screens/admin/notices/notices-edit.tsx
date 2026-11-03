"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearListCache } from "@/api/cache";
import { deletePost, getPostDetail, updatePost } from "@/api/posts";
import type { PortfolioAttachment } from "@/api/posts";
import { Button } from "@/shared/ui/button/button";
import { FileUploader, FileListItem } from "@/shared/ui/file-uploader/file-uploader";
import { ChevronLeftIcon, TrashIcon } from "@/shared/ui/icons";
import { Input } from "@/shared/ui/input/input";
import { Loading } from "@/shared/ui/loading";
import { RichEditor, isRichTextEmpty } from "@/shared/ui/rich-editor";

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
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [existingFiles, setExistingFiles] = useState<PortfolioAttachment[]>([]);
  const [deleteAttachmentIds, setDeleteAttachmentIds] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(postId)) return;

    let isMounted = true;

    const fetchDetail = async () => {
      try {
        const detail = await getPostDetail("NOTICE", postId);
        if (!isMounted) return;
        setTitle(detail.title);
        setDescription(detail.description ?? "");
        setContent(detail.content ?? "");
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

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      setError("간단한 소개를 입력해주세요.");
      return;
    }

    if (isRichTextEmpty(content)) {
      setError("내용을 입력해주세요.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const request = {
        title: trimmedTitle,
        description: trimmedDescription,
        content,
        visibility: "PUBLIC" as const,
      };
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

  const isBusy = isSubmitting || isLoading;

  // 작성 화면(notices-create)과 같은 폼 레이아웃을 쓰되, 뒤로가기 버튼이 들어갈 만큼
  // 왼쪽 여백을 항상 56px(버튼 40px + 간격 16px)보다 넓게 둔다.
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col pt-12 pr-6 pb-[100px] pl-16 md:px-16 xl:px-24">
      {/* 1. 타이틀 영역 */}
      <div className="mb-12 border-b border-gray-900 pb-6">
        <div className="flex items-center justify-between gap-4">
          {/* 버튼을 왼쪽 여백으로 빼서 제목이 폼 왼쪽 선에서 시작하게 한다. */}
          <div className="-ml-14 flex items-center gap-4">
            <Button
              variant="secondary"
              icon={<ChevronLeftIcon />}
              onClick={() => router.back()}
              disabled={isSubmitting}
              aria-label="뒤로가기"
              className="shrink-0"
            />
            <h1 className="text-[40px] font-bold text-gray-900">공지사항 수정</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => void handleSubmit()}
              disabled={isBusy}
              className="shrink-0"
            >
              {isSubmitting ? "수정 중..." : "수정"}
            </Button>
            <Button
              variant="danger"
              icon={<TrashIcon size={16} />}
              iconPosition="left"
              onClick={() => void handleDelete()}
              disabled={isBusy}
              className="shrink-0"
            >
              삭제
            </Button>
          </div>
        </div>
        <p className="mt-2 text-[15px] text-gray-500">등록된 공지사항의 내용을 수정하세요</p>
      </div>

      {error && (
        <p role="alert" className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-[14px] text-red-600">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loading text="불러오는 중" />
        </div>
      ) : (
        <>
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
                onFileSelect={(selected) => setNewFiles((prev) => [...prev, ...selected])}
              />

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
          </section>
        </>
      )}
    </div>
  );
};
