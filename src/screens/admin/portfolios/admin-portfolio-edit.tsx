"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPortfolioDetail, type PortfolioDetail } from "@/api/posts";
import { useEditorImageSession } from "@/lib/editor-images";
import { useDeletePortfolio, useUpdatePortfolio } from "@/lib/posts";
import { toPortfolioFormInitialValues } from "@/screens/portfolio-edit";
import { PortfolioForm, type PortfolioFormSubmitValue } from "@/screens/portfolio-form";
import { Button } from "@/shared/ui";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { ChevronLeftIcon, TrashIcon } from "@/shared/ui/icons";
import { Loading } from "@/shared/ui/loading";

const BOARD_TYPE = "PORTFOLIO";
const LIST_PATH = "/admin/portfolios";

// 백엔드가 관리자에게 공개 글의 수정·삭제를 허용한다. 일반 수정 화면은 본인 글만 받으므로 따로 둔다.
const AdminPortfolioEdit = ({ postId }: { postId: number }) => {
  const router = useRouter();
  const { submit, isSubmitting, error: submitError } = useUpdatePortfolio();
  const { remove, isDeleting, error: deleteError } = useDeletePortfolio();
  const [detail, setDetail] = useState<PortfolioDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const editorImages = useEditorImageSession("posts", detail?.content ?? "");

  useEffect(() => {
    let isCancelled = false;

    getPortfolioDetail(BOARD_TYPE, postId)
      .then((data) => {
        if (!isCancelled) setDetail(data);
      })
      .catch((cause: unknown) => {
        console.error("[admin] 포트폴리오 조회 실패", cause);
        if (!isCancelled) setLoadError("포트폴리오를 불러오지 못했습니다.");
      });

    return () => {
      isCancelled = true;
    };
  }, [postId]);

  const handleSubmit = async ({
    fields,
    thumbnail,
    images,
    files,
    deleteAttachmentIds,
  }: PortfolioFormSubmitValue) => {
    const updated = await submit(
      BOARD_TYPE,
      postId,
      {
        title: fields.title,
        description: fields.description,
        content: fields.content,
        videoLink: fields.videoLink,
        githubLink: fields.githubLink,
        visibility: fields.visibility,
        keywordIds: fields.keywordIds,
        deleteAttachmentIds,
      },
      { thumbnail, images, files },
    );

    if (updated) {
      editorImages.commit(fields.content ?? "");
      router.push(LIST_PATH);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 포트폴리오를 삭제하시겠습니까?")) return;
    if (await remove(BOARD_TYPE, postId)) router.push(LIST_PATH);
  };

  if (loadError) {
    return (
      <div className="flex-1 bg-white p-8">
        <EmptyState variant="error" title="불러오지 못했습니다" description={loadError} />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-1 justify-center bg-white p-16">
        <Loading text="불러오는 중" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <div className="flex items-center justify-between px-8 pt-8">
        <Button
          variant="secondary"
          icon={<ChevronLeftIcon />}
          onClick={() => router.push(LIST_PATH)}
          aria-label="목록으로"
        />
        <Button
          variant="danger"
          iconPosition="left"
          icon={<TrashIcon size={18} />}
          onClick={() => void handleDelete()}
          isLoading={isDeleting}
          disabled={isSubmitting}
        >
          삭제
        </Button>
      </div>
      {deleteError && (
        <p role="alert" className="px-8 pt-2 text-[14px] text-[var(--color-error-500,#ef4444)]">
          삭제하지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}
      <PortfolioForm
        key={postId}
        heading="포트폴리오 수정"
        headingDescription="포트폴리오를 수정하세요"
        submitLabel="저장"
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={() => router.push(LIST_PATH)}
        onUploadEditorImage={editorImages.uploadImage}
        canPasteEditorImage={editorImages.canPasteImage}
        initialValues={toPortfolioFormInitialValues(detail)}
        existingThumbnailUrl={detail.thumbnailImage}
        existingImages={detail.images}
        existingFiles={detail.files}
      />
    </div>
  );
};

export const AdminPortfolioEditRoute = () => {
  const id = useSearchParams().get("id");

  if (id === null || !/^\d+$/.test(id)) {
    return (
      <div className="flex-1 bg-white p-8">
        <EmptyState variant="no-content" title="잘못된 접근입니다" />
      </div>
    );
  }

  return <AdminPortfolioEdit key={id} postId={Number(id)} />;
};
