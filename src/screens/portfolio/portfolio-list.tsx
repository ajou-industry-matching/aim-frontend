"use client";

import type { PortfolioListItem } from "@/api/posts";
import { Card } from "@/shared/ui/card/card";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { Spinner } from "@/shared/ui/spinner/spinner";

export type PortfolioListProps = {
  portfolios: PortfolioListItem[];
  isLoading: boolean;
  error: string | null;
  hasKeyword: boolean;
};

const gridClasses = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

const formatPortfolioDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}.`;
};

const toCardTags = (item: PortfolioListItem): string[] =>
  item.keywords.map((keyword) => `#${keyword.keywordName}`);

const toAuthorLabel = (item: PortfolioListItem): string => `사용자 ${item.userId}`;

export const PortfolioList = ({ portfolios, isLoading, error, hasKeyword }: PortfolioListProps) => {
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        role="status"
        aria-label="포트폴리오 로딩 중"
      >
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="포트폴리오를 불러오지 못했습니다"
        description={error}
        hasBackground
      />
    );
  }

  if (portfolios.length === 0) {
    return (
      <EmptyState
        variant={hasKeyword ? "no-results" : "no-content"}
        title={hasKeyword ? "검색 결과가 없습니다" : "포트폴리오가 없습니다"}
        description={
          hasKeyword ? "다른 검색어로 다시 시도해보세요." : "아직 등록된 포트폴리오가 없습니다."
        }
        hasBackground
      />
    );
  }

  return (
    <div className={gridClasses} role="region" aria-label="포트폴리오 목록">
      {portfolios.map((item) => (
        <Card
          key={item.postId}
          variant="post"
          href={`/portfolio/${item.postId}`}
          thumbnail={item.thumbnailImage ?? undefined}
          tags={toCardTags(item)}
          title={item.title}
          description={item.description}
          author={{ name: toAuthorLabel(item) }}
          date={formatPortfolioDate(item.createdAt)}
          stats={{
            likes: item.likeCount,
            comments: item.commentCount,
            views: item.viewCount,
          }}
        />
      ))}
    </div>
  );
};
