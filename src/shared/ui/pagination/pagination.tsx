import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/ui/icons";

// --- Types ---
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

// --- Styles ---

// 1. Common Button Styles
const buttonBaseClasses =
  "flex items-center justify-center text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-all duration-200 rounded-md";

// 2. Control Button Styles (Prev/Next)
const controlBtnBaseClasses = `${buttonBaseClasses} h-10 px-4 py-[10px] gap-2`;

const getControlBtnClasses = (isDisabled: boolean) => {
  const statusClasses = isDisabled
    ? "text-[var(--color-gray-300,#ccc)] cursor-not-allowed"
    : "text-[var(--color-gray-600,#666)] hover:bg-[var(--color-gray-50,#f9f9f9)] cursor-pointer";
  return [controlBtnBaseClasses, statusClasses].join(" ");
};

// 3. Page Number Styles
const pageNumBaseClasses = `${buttonBaseClasses} w-10 h-10 border`;

const getPageNumClasses = (isActive: boolean) => {
  const statusClasses = isActive
    ? "bg-[var(--color-primary-800,#004a9c)] text-white border-[var(--color-primary-800,#004a9c)]"
    : "bg-white border-[var(--color-gray-200,#e5e5e5)] text-[var(--color-gray-600,#666)] hover:border-[var(--color-primary-800,#004a9c)] cursor-pointer";
  return [pageNumBaseClasses, statusClasses].join(" ");
};

// --- Component ---
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) => {
  const maxVisiblePages = 9;

  // Calculate page range to display
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust start if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, i) => startPage + i,
  );

  const containerClasses = ["flex items-center gap-2", className].filter(Boolean).join(" ");

  // --- Guard Logic for Controls ---
  const isPrevDisabled = totalPages <= 1 || currentPage <= 1 || currentPage > totalPages;
  const isNextDisabled = totalPages <= 0 || currentPage >= totalPages;

  const handlePrevClick = () => {
    const prevPage = Math.max(1, currentPage - 1);
    if (totalPages > 0 && prevPage < currentPage) {
      onPageChange(prevPage);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className={containerClasses} role="navigation" aria-label="Pagination">
      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePrevClick}
        disabled={isPrevDisabled}
        aria-disabled={isPrevDisabled}
        aria-label="Previous Page"
        className={getControlBtnClasses(isPrevDisabled)}
      >
        <ChevronLeftIcon size={16} className={isPrevDisabled ? "opacity-30" : ""} />
        <span>이전</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => handlePageClick(page)}
              className={getPageNumClasses(isActive)}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNextClick}
        disabled={isNextDisabled}
        aria-disabled={isNextDisabled}
        aria-label="Next Page"
        className={getControlBtnClasses(isNextDisabled)}
      >
        <span>다음</span>
        <ChevronRightIcon size={16} className={isNextDisabled ? "opacity-30" : ""} />
      </button>
    </div>
  );
};

Pagination.displayName = "Pagination";
