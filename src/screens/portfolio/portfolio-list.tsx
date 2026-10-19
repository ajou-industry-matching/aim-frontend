"use client";

import type { PortfolioListItem } from "@/api/posts";
import { Card } from "@/shared/ui/card/card";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { Loading } from "@/shared/ui/loading";

// 목록이 비었을 때 표시할 문구/아이콘. 검색·프로필 등 사용처마다 다르게 전달한다.
export type PortfolioListEmptyState = {
  variant: "no-results" | "no-content";
  title: string;
  description: string;
};

export type PortfolioListProps = {
  portfolios: PortfolioListItem[];
  isLoading: boolean;
  error: string | null;
  emptyState: PortfolioListEmptyState;
};

const gridClasses = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const portfolioListStateClasses = "flex min-h-[420px] items-center justify-center";

// 브라우저 타임존과 무관하게 KST(Asia/Seoul) 기준으로 표기한다.
const portfolioDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const formatPortfolioDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const parts = portfolioDateFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")}.`;
};

const toCardTags = (item: PortfolioListItem): string[] =>
  item.keywords.map((keyword) => `#${keyword.keywordName}`);

// 작성자 이름(authorName)을 표시하고, 비어있으면 사용자 ID로 폴백한다.
const toAuthorLabel = (item: PortfolioListItem): string =>
  item.authorName?.trim() || `사용자 ${item.userId}`;

export const PortfolioList = ({ portfolios, isLoading, error, emptyState }: PortfolioListProps) => {
  // 라우트 전환 로딩과 같은 표현을 써서 한 번의 로딩으로 이어 보이게 한다.
  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loading text="불러오는 중" size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={portfolioListStateClasses}>
        <EmptyState
          variant="error"
          title="포트폴리오를 불러오지 못했습니다"
          description={error}
          hasBackground
        />
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className={portfolioListStateClasses}>
        <EmptyState
          variant={emptyState.variant}
          title={emptyState.title}
          description={emptyState.description}
          hasBackground
        />
      </div>
    );
  }

  return (
    <div className={gridClasses} role="region" aria-label="포트폴리오 목록">
      {portfolios.map((item) => (
        <Card
          key={item.postId}
          variant="post"
          href={`/portfolio/detail?id=${item.postId}&type=${item.boardType}`}
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
