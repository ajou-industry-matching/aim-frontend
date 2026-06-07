"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPortfolioDetail, type PortfolioBoardType, type PortfolioDetail } from "@/api/posts";
import { useAuthReady } from "@/lib/auth";
import { Button } from "@/shared/ui/button/button";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { RichEditor } from "@/shared/ui/rich-editor";
import { Spinner } from "@/shared/ui/spinner/spinner";
import { Tag } from "@/shared/ui/tag/tag";
import { ExternalLinkIcon } from "@/shared/ui/icons";
import { PortfolioAttachments } from "./portfolio-attachments";
import { PortfolioLikeButton } from "./portfolio-like-button";

export type PortfolioDetailPageProps = {
  postId: number;
  boardType: PortfolioBoardType;
};

const sectionTitleClasses =
  "text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[var(--color-gray-900,#1a1a1a)]";

const getErrorMessage = (cause: unknown): string => {
  if (cause instanceof Error && cause.message) return cause.message;
  return "포트폴리오를 불러오지 못했습니다.";
};

const openExternalLink = (url: string) => {
  if (typeof window === "undefined") return;
  window.open(url, "_blank", "noopener,noreferrer");
};

type DetailFetchResult = {
  fetchKey: string;
  detail?: PortfolioDetail;
  error?: string;
};

const toDetailFetchKey = (boardType: PortfolioBoardType, postId: number): string =>
  `${boardType}|${postId}`;

export const PortfolioDetailPage = ({ postId, boardType }: PortfolioDetailPageProps) => {
  const router = useRouter();
  const { isReady: isAuthReady, isAuthenticated } = useAuthReady();
  const [result, setResult] = useState<DetailFetchResult | null>(null);

  const fetchKey = toDetailFetchKey(boardType, postId);
  const isUnauthorizedSession = isAuthReady && !isAuthenticated;
  const hasMatchingResult = result?.fetchKey === fetchKey;
  const isLoading = !isAuthReady || (!isUnauthorizedSession && !hasMatchingResult);
  const detail = hasMatchingResult ? result.detail : undefined;
  const errorMessage = hasMatchingResult ? (result.error ?? null) : null;

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
        setResult({ fetchKey, error: getErrorMessage(cause) });
      });

    return () => {
      isCancelled = true;
    };
  }, [isAuthReady, isAuthenticated, boardType, postId, fetchKey]);

  const renderBody = () => {
    if (isLoading) {
      return (
        <div
          className="flex items-center justify-center py-24"
          role="status"
          aria-label="불러오는 중"
        >
          <Spinner size="large" />
        </div>
      );
    }

    if (isUnauthorizedSession) {
      return (
        <EmptyState
          variant="access-denied"
          title="로그인이 필요합니다"
          description="로그인 후 다시 시도해주세요."
          hasBackground
        />
      );
    }

    if (errorMessage) {
      return (
        <EmptyState
          variant="error"
          title="포트폴리오를 불러오지 못했습니다"
          description={errorMessage}
          hasBackground
        />
      );
    }

    if (!detail) return null;

    return (
      <div className="flex flex-col gap-12">
        {/* 좋아요 */}
        <div className="flex justify-end">
          <PortfolioLikeButton
            postId={detail.postId}
            initialLiked={Boolean(detail.liked)}
            initialLikeCount={detail.likeCount}
          />
        </div>

        {/* 헤더: 썸네일 + 상세 정보 */}
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="relative aspect-[680/383] w-full flex-shrink-0 overflow-hidden rounded-xl bg-[var(--color-gray-100,#f2f2f2)] lg:w-[680px]">
            {detail.thumbnailImage && (
              <img
                src={detail.thumbnailImage}
                alt={detail.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between gap-6">
            <div className="flex flex-col gap-5">
              <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-1px] text-[var(--color-gray-800,#333)]">
                {detail.title}
              </h1>
              <p className="whitespace-pre-line text-[16px] leading-[1.5] tracking-[-0.4px] text-[var(--color-gray-600,#666)]">
                {detail.description}
              </p>
            </div>

            {(detail.videoLink || detail.githubLink) && (
              <div className="flex flex-wrap items-center gap-4">
                {detail.videoLink && (
                  <Button
                    variant="secondary"
                    size="small"
                    iconPosition="right"
                    icon={<ExternalLinkIcon size={16} />}
                    onClick={() => openExternalLink(detail.videoLink as string)}
                  >
                    시연영상
                  </Button>
                )}
                {detail.githubLink && (
                  <Button
                    variant="secondary"
                    size="small"
                    iconPosition="right"
                    icon={<ExternalLinkIcon size={16} />}
                    onClick={() => openExternalLink(detail.githubLink as string)}
                  >
                    Github
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 본문 */}
        <section className="flex flex-col gap-5">
          <h2 className={sectionTitleClasses}>포트폴리오</h2>
          <RichEditor content={detail.content} isEditable={false} />
        </section>

        {/* 태그 */}
        {detail.keywords.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className={sectionTitleClasses}>태그</h2>
            <div className="flex flex-wrap gap-2">
              {detail.keywords.map((keyword) => (
                <Tag key={keyword.keywordId}>{`#${keyword.keywordName}`}</Tag>
              ))}
            </div>
          </section>
        )}

        {/* 첨부파일 */}
        <section className="flex flex-col gap-5">
          <h2 className={sectionTitleClasses}>첨부파일</h2>
          <PortfolioAttachments files={detail.files} />
        </section>

        {/* 목록으로 */}
        <div className="flex justify-center pt-4">
          <Button variant="primary" size="large" onClick={() => router.push("/portfolio")}>
            목록
          </Button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-16">{renderBody()}</div>
    </main>
  );
};
