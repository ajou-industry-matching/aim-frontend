"use client";

import type { PortfolioListItem } from "@/api/posts";
import { Loading } from "@/shared/ui";
import { Card } from "@/shared/ui/card/card";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";

export type ProfilePostsGridProps = {
  posts: PortfolioListItem[];
  isLoading: boolean;
  error: string | null;
  emptyTitle: string;
  emptyDescription: string;
};

const gridClasses = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}.`;
};

// 작성자 이름(authorName)을 표시하고, 비어있으면 사용자 ID로 폴백한다.
const toAuthorLabel = (item: PortfolioListItem): string =>
  item.authorName?.trim() || `사용자 ${item.userId}`;

export const ProfilePostsGrid = ({
  posts,
  isLoading,
  error,
  emptyTitle,
  emptyDescription,
}: ProfilePostsGridProps) => {
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        role="status"
        aria-label="게시글 로딩 중"
      >
        <Loading text="게시글을 불러오는 중" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="게시글을 불러오지 못했습니다"
        description={error}
        hasBackground
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        variant="no-content"
        title={emptyTitle}
        description={emptyDescription}
        hasBackground
      />
    );
  }

  return (
    <div className={gridClasses} role="region" aria-label="게시글 목록">
      {posts.map((item) => (
        <Card
          key={item.postId}
          variant="post"
          href={`/portfolio/detail?id=${item.postId}&type=${item.boardType}`}
          thumbnail={item.thumbnailImage ?? undefined}
          tags={item.keywords.map((keyword) => `#${keyword.keywordName}`)}
          title={item.title}
          description={item.description}
          author={{ name: toAuthorLabel(item) }}
          date={formatDate(item.createdAt)}
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
