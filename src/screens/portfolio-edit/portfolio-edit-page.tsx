"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPortfolioDetail, type PortfolioBoardType, type PortfolioDetail } from "@/api/posts";
import { useAuthReady } from "@/lib/auth";
import { useUpdatePortfolio } from "@/lib/posts";
import { useCurrentUser } from "@/lib/user";
import {
  PortfolioForm,
  type PortfolioFormInitialValues,
  type PortfolioFormSubmitValue,
} from "@/screens/portfolio-form";
import { Button } from "@/shared/ui/button/button";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { Spinner } from "@/shared/ui/spinner/spinner";

export type PortfolioEditPageProps = {
  postId: number;
  boardType: PortfolioBoardType;
};

const toInitialValues = (detail: PortfolioDetail): PortfolioFormInitialValues => ({
  title: detail.title,
  description: detail.description ?? "",
  content: detail.content ?? "",
  videoLink: detail.videoLink ?? "",
  githubLink: detail.githubLink ?? "",
  visibility: detail.visibility,
  keywordIds: detail.keywords.map((keyword) => keyword.keywordId),
});

const getErrorMessage = (cause: unknown): string => {
  if (cause instanceof Error && cause.message) return cause.message;
  return "포트폴리오를 불러오지 못했습니다.";
};

const CenteredMain = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-white">
    <div className="mx-auto max-w-[1440px] px-6 py-20">{children}</div>
  </main>
);

export const PortfolioEditPage = ({ postId, boardType }: PortfolioEditPageProps) => {
  const router = useRouter();
  const { isReady: isAuthReady, isAuthenticated } = useAuthReady();
  const { profile, isResolved: isProfileResolved } = useCurrentUser();
  const { submit, isSubmitting, error: submitError } = useUpdatePortfolio();

  const [detail, setDetail] = useState<PortfolioDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 미인증 사용자는 로그인 페이지로 보낸다(수정은 로그인 필수).
  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthReady, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) return;

    let isCancelled = false;

    getPortfolioDetail(boardType, postId)
      .then((response) => {
        if (isCancelled) return;
        setDetail(response);
      })
      .catch((cause: unknown) => {
        if (isCancelled) return;
        setLoadError(getErrorMessage(cause));
      });

    return () => {
      isCancelled = true;
    };
  }, [isAuthReady, isAuthenticated, boardType, postId]);

  const handleSubmit = async ({
    fields,
    thumbnail,
    images,
    files,
    deleteAttachmentIds,
  }: PortfolioFormSubmitValue) => {
    const updated = await submit(
      boardType,
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
      router.push(`/portfolio/detail?id=${updated.postId}&type=${updated.boardType}`);
    }
  };

  if (loadError) {
    return (
      <CenteredMain>
        <EmptyState
          variant="error"
          title="포트폴리오를 불러오지 못했습니다"
          description={loadError}
          hasBackground
        />
      </CenteredMain>
    );
  }

  // 인증/상세/프로필 확정 전에는 로딩 표시 (소유자 판별을 위해 프로필까지 대기)
  if (!isAuthReady || !isAuthenticated || !detail || !isProfileResolved) {
    return (
      <CenteredMain>
        <div
          className="flex items-center justify-center py-24"
          role="status"
          aria-label="불러오는 중"
        >
          <Spinner size="large" />
        </div>
      </CenteredMain>
    );
  }

  const isOwner = profile != null && profile.userId === detail.userId;
  if (!isOwner) {
    return (
      <CenteredMain>
        <EmptyState
          variant="no-content"
          title="수정 권한이 없습니다"
          description="본인이 작성한 포트폴리오만 수정할 수 있습니다."
          hasBackground
        />
        <div className="mt-6 flex justify-center">
          <Button
            variant="primary"
            size="large"
            onClick={() => router.push(`/portfolio/detail?id=${postId}&type=${boardType}`)}
          >
            상세로 돌아가기
          </Button>
        </div>
      </CenteredMain>
    );
  }

  return (
    <PortfolioForm
      heading="포트폴리오 수정"
      headingDescription="프로젝트 내용을 최신 상태로 업데이트하세요"
      submitLabel="수정하기"
      isSubmitting={isSubmitting}
      submitError={submitError}
      onSubmit={handleSubmit}
      onCancel={() => router.push(`/portfolio/detail?id=${postId}&type=${boardType}`)}
      initialValues={toInitialValues(detail)}
      existingThumbnailUrl={detail.thumbnailImage}
      existingImages={detail.images}
      existingFiles={detail.files}
    />
  );
};
