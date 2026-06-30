"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
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
import { PortfolioComments } from "./portfolio-comments";
import { PortfolioLikeButton } from "./portfolio-like-button";

export type PortfolioDetailPageProps = {
  postId: number;
  boardType: PortfolioBoardType;
};

const sectionTitleClasses =
  "text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[var(--color-gray-900,#1a1a1a)]";

// 글로벌 Navigation 높이(sticky top-0 h-[80px])만큼 탭바를 아래에 고정한다.
const NAV_HEIGHT = 80;

type DetailTab = "intro" | "files" | "comments";

const tabBaseClasses =
  "flex flex-1 items-center justify-center px-6 py-3 text-[16px] font-medium leading-[1.5] tracking-[-0.4px] text-[var(--color-gray-600,#666)] transition-colors";

const getTabClasses = (isActive: boolean): string =>
  [
    tabBaseClasses,
    isActive
      ? "border-b-2 border-[var(--color-primary-800,#004a9c)]"
      : "border-b-2 border-[var(--color-gray-200,#e5e5e5)]",
  ].join(" ");

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
  const hasMatchingResult = result?.fetchKey === fetchKey;
  // 비로그인도 조회 가능. 인증 상태가 확정(isReady)되면 조회한다.
  const isLoading = !isAuthReady || !hasMatchingResult;
  const detail = hasMatchingResult ? result.detail : undefined;
  const errorMessage = hasMatchingResult ? (result.error ?? null) : null;

  useEffect(() => {
    if (!isAuthReady) return;

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

  const [activeTab, setActiveTab] = useState<DetailTab>("intro");
  const tabBarRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (tab: DetailTab) => {
    setActiveTab(tab);
    const sectionRefs: Record<DetailTab, RefObject<HTMLDivElement | null>> = {
      intro: introRef,
      files: filesRef,
      comments: commentsRef,
    };
    const target = sectionRefs[tab].current;
    if (!target) return;
    const tabBarHeight = tabBarRef.current?.offsetHeight ?? 56;
    const top =
      target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - tabBarHeight - 16;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="mx-auto max-w-[1440px] px-6 py-20">
          <div
            className="flex items-center justify-center py-24"
            role="status"
            aria-label="불러오는 중"
          >
            <Spinner size="large" />
          </div>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="mx-auto max-w-[1440px] px-6 py-20">
          <EmptyState
            variant="error"
            title="포트폴리오를 불러오지 못했습니다"
            description={errorMessage}
            hasBackground
          />
        </div>
      );
    }

    if (!detail) return null;

    return (
      <>
        {/* 헤더: 좋아요 + 썸네일/상세 정보 */}
        <div className="mx-auto max-w-[1440px] px-6 py-20">
          <div className="flex flex-col gap-10">
            {/* 좋아요 */}
            <div className="flex justify-end">
              <PortfolioLikeButton
                postId={detail.postId}
                initialLiked={Boolean(detail.liked)}
                initialLikeCount={detail.likeCount}
              />
            </div>

            {/* 썸네일 + 상세 정보 */}
            <div className="flex flex-col gap-10 lg:flex-row">
              <div className="relative aspect-[680/383] w-full flex-shrink-0 overflow-hidden rounded-xl bg-[var(--color-gray-100,#f2f2f2)] lg:h-[383px] lg:w-[680px]">
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
          </div>
        </div>

        {/* 스티키 탭바 (글로벌 Navigation 80px 아래) */}
        <div
          className="sticky z-40 border-b border-[var(--color-gray-200,#e5e5e5)] bg-white shadow-sm"
          style={{ top: NAV_HEIGHT }}
        >
          <div className="mx-auto max-w-[1440px] px-6">
            <div ref={tabBarRef} className="flex h-14">
              <button
                type="button"
                onClick={() => scrollToSection("intro")}
                className={getTabClasses(activeTab === "intro")}
              >
                포트폴리오 소개
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("files")}
                className={getTabClasses(activeTab === "files")}
              >
                첨부파일
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("comments")}
                className={getTabClasses(activeTab === "comments")}
              >
                댓글
              </button>
            </div>
          </div>
        </div>

        {/* 콘텐츠 섹션 */}
        <div className="mx-auto max-w-[1440px] px-6 pb-20">
          <div className="flex flex-col gap-20">
            {/* 소개: 본문 + 태그 */}
            <div ref={introRef} className="flex flex-col gap-10 pt-[60px]">
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
            </div>

            {/* 첨부파일 */}
            <section ref={filesRef} className="flex flex-col gap-5 pt-[60px]">
              <h2 className={sectionTitleClasses}>첨부파일</h2>
              <PortfolioAttachments files={detail.files} />
            </section>

            {/* 댓글 (백엔드 API 미구현 — 목업 데이터로 UI만 구성) */}
            <section ref={commentsRef} className="pt-[60px]">
              <PortfolioComments postId={detail.postId} />
            </section>

            {/* 목록으로 */}
            <div className="flex justify-center">
              <Button variant="primary" size="large" onClick={() => router.push("/portfolio")}>
                목록
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return <main className="min-h-screen bg-white">{renderBody()}</main>;
};
