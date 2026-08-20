"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPortfolioDetail, type PortfolioBoardType, type PortfolioDetail } from "@/api/posts";
import { useAuthReady } from "@/lib/auth";
import { useUpdatePortfolio } from "@/lib/posts";
import { useCurrentUserId } from "@/lib/user";
import {
  PortfolioForm,
  type PortfolioFormInitialValues,
  type PortfolioFormSubmitValue,
} from "@/screens/portfolio-form";
import { Button } from "@/shared/ui/button/button";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { PageLoading } from "@/shared/ui/loading";

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

const LOAD_ERROR_MESSAGE = "포트폴리오를 불러오지 못했습니다.";

type EditFetchResult = {
  fetchKey: string;
  detail?: PortfolioDetail;
  error?: string;
};

const toEditFetchKey = (boardType: PortfolioBoardType, postId: number): string =>
  `${boardType}|${postId}`;

const CenteredMain = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-white">
    <div className="mx-auto max-w-[1440px] px-6 py-20">{children}</div>
  </main>
);

export const PortfolioEditPage = ({ postId, boardType }: PortfolioEditPageProps) => {
  const router = useRouter();
  const { isReady: isAuthReady, isAuthenticated } = useAuthReady();
  const { userId: currentUserId, isResolved: isProfileResolved } = useCurrentUserId();
  const { submit, isSubmitting, error: submitError } = useUpdatePortfolio();

  const [result, setResult] = useState<EditFetchResult | null>(null);

  // 현재 파라미터와 일치하는 조회 결과만 사용한다(edit?id=1 → id=2 이동 시 이전 글 노출/제출 방지).
  const fetchKey = toEditFetchKey(boardType, postId);
  const hasMatchingResult = result?.fetchKey === fetchKey;
  const detail = hasMatchingResult ? result.detail : undefined;
  const loadError = hasMatchingResult ? (result.error ?? null) : null;

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
        setResult({ fetchKey, detail: response });
      })
      .catch((cause: unknown) => {
        if (isCancelled) return;
        console.error(LOAD_ERROR_MESSAGE, cause);
        setResult({ fetchKey, error: LOAD_ERROR_MESSAGE });
      });

    return () => {
      isCancelled = true;
    };
  }, [isAuthReady, isAuthenticated, boardType, postId, fetchKey]);

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
    return <PageLoading />;
  }

  const isOwner = currentUserId != null && currentUserId === detail.userId;
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
      key={fetchKey}
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
