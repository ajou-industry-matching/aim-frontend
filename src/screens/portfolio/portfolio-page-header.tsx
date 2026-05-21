"use client";

import type { PortfolioSort } from "@/api/posts";

export type PortfolioPageHeaderProps = {
  totalCount: number;
  sort: PortfolioSort;
  onSortChange: (sort: PortfolioSort) => void;
  keyword: string;
};

type PortfolioSortOption = {
  label: string;
  value: PortfolioSort;
};

const portfolioSortOptions: PortfolioSortOption[] = [
  { label: "최신순", value: "latest" },
  { label: "인기순", value: "popular" },
  { label: "조회순", value: "views" },
];

const titleClasses =
  "text-[40px] font-bold leading-[1.3] tracking-[-1px] text-[var(--color-gray-800,#333)]";

const countClasses =
  "pb-1 text-[18px] leading-[1.56] tracking-[-0.45px] text-[var(--color-gray-500,#808080)]";

const countNumberClasses = "font-semibold text-[var(--color-primary-800,#004a9c)]";

const sortButtonBaseClasses =
  "h-10 rounded-lg px-6 py-[10px] text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors";

const sortButtonActiveClasses = "bg-[var(--color-primary-800,#004a9c)] text-white";

const sortButtonInactiveClasses =
  "border border-[var(--color-gray-200,#e5e5e5)] text-[var(--color-gray-600,#666)] hover:border-[var(--color-primary-800,#004a9c)] hover:text-[var(--color-primary-800,#004a9c)]";

const getSortButtonClasses = (isActive: boolean): string =>
  [sortButtonBaseClasses, isActive ? sortButtonActiveClasses : sortButtonInactiveClasses].join(" ");

export const PortfolioPageHeader = ({
  totalCount,
  sort,
  onSortChange,
  keyword,
}: PortfolioPageHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className={titleClasses}>
          {keyword ? `"${keyword}"에 대한 검색 결과` : "포트폴리오 탐색"}
        </h1>
        <p className={countClasses} aria-live="polite" aria-atomic="true">
          총 <span className={countNumberClasses}>{totalCount.toLocaleString()}</span>개
        </p>
      </div>

      <div className="flex items-center gap-3">
        {portfolioSortOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSortChange(option.value)}
            className={getSortButtonClasses(sort === option.value)}
            aria-pressed={sort === option.value}
            aria-label={`${option.label}으로 정렬`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
