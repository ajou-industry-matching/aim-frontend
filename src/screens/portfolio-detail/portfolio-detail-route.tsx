"use client";

import { useSearchParams } from "next/navigation";
import { PORTFOLIO_BOARD_TYPES_ALL, type PortfolioBoardType } from "@/api/posts";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { PortfolioDetailPage } from "./portfolio-detail-page";

const isPortfolioBoardType = (value: string | null): value is PortfolioBoardType =>
  value !== null && (PORTFOLIO_BOARD_TYPES_ALL as string[]).includes(value);

export const PortfolioDetailRoute = () => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const postId = Number(idParam);
  const typeParam = searchParams.get("type");
  const boardType: PortfolioBoardType = isPortfolioBoardType(typeParam) ? typeParam : "PORTFOLIO";

  const isValidPostId = Boolean(idParam) && Number.isInteger(postId) && postId > 0;

  if (!isValidPostId) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16">
          <EmptyState
            variant="no-content"
            title="잘못된 접근입니다"
            description="유효한 포트폴리오를 찾을 수 없습니다."
            hasBackground
          />
        </div>
      </main>
    );
  }

  return <PortfolioDetailPage postId={postId} boardType={boardType} />;
};
