"use client";

import { useEffect, useState } from "react";
import {
  getPortfolioList,
  searchPortfolios,
  type PortfolioBoardType,
  type PortfolioListPageResponse,
  type PortfolioSort,
} from "@/api/posts";
import { useAuthReady } from "@/lib/auth";
import { Pagination } from "@/shared/ui";
import { PortfolioList } from "./portfolio-list";
import { PortfolioPageHeader } from "./portfolio-page-header";
import { PortfolioSearchBar } from "./portfolio-search-bar";
import { PortfolioTypeFilter } from "./portfolio-type-filter";

const PORTFOLIO_PAGE_SIZE = 12;

const getErrorMessage = (cause: unknown): string => {
  if (cause instanceof Error && cause.message) return cause.message;
  return "포트폴리오를 불러오지 못했습니다.";
};

type PortfolioQuery = {
  page: number;
  sort: PortfolioSort;
  keyword: string;
  selectedTypes: PortfolioBoardType[];
};

type PortfolioFetchResult = {
  queryKey: string;
  data?: PortfolioListPageResponse;
  error?: string;
};

const toPortfolioQueryKey = ({ page, sort, keyword, selectedTypes }: PortfolioQuery): string =>
  `${page}|${sort}|${keyword}|${[...selectedTypes].sort().join(",")}`;

export const PortfolioListPage = () => {
  const { isReady: isAuthReady, isAuthenticated } = useAuthReady();
  const [query, setQuery] = useState<PortfolioQuery>({
    page: 1,
    sort: "LATEST",
    keyword: "",
    selectedTypes: [],
  });
  const [result, setResult] = useState<PortfolioFetchResult | null>(null);

  const queryKey = toPortfolioQueryKey(query);
  const isUnauthorizedSession = isAuthReady && !isAuthenticated;
  const hasMatchingResult = result?.queryKey === queryKey;
  const isLoading = !isAuthReady || (!isUnauthorizedSession && !hasMatchingResult);
  const data = hasMatchingResult ? result.data : undefined;
  const error = isUnauthorizedSession
    ? "로그인이 필요합니다. 로그인 후 다시 시도해주세요."
    : hasMatchingResult
      ? (result.error ?? null)
      : null;

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) return;

    let isCancelled = false;
    const pageable = {
      page: query.page - 1,
      size: PORTFOLIO_PAGE_SIZE,
      sort: query.sort,
      boardTypes: query.selectedTypes,
    };
    const request = query.keyword
      ? searchPortfolios({ ...pageable, keyword: query.keyword })
      : getPortfolioList(pageable);

    request
      .then((response) => {
        if (isCancelled) return;
        setResult({ queryKey, data: response });
      })
      .catch((cause: unknown) => {
        if (isCancelled) return;
        setResult({ queryKey, error: getErrorMessage(cause) });
      });

    return () => {
      isCancelled = true;
    };
  }, [isAuthReady, isAuthenticated, queryKey]);

  const handleSearchSubmit = (nextKeyword: string) => {
    setQuery((previous) => ({ ...previous, keyword: nextKeyword, page: 1 }));
  };

  const handleSortChange = (nextSort: PortfolioSort) => {
    setQuery((previous) =>
      previous.sort === nextSort ? previous : { ...previous, sort: nextSort, page: 1 },
    );
  };

  const handleTypesChange = (nextTypes: PortfolioBoardType[]) => {
    setQuery((previous) => ({ ...previous, selectedTypes: nextTypes, page: 1 }));
  };

  const handlePageChange = (nextPage: number) => {
    setQuery((previous) => ({ ...previous, page: nextPage }));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-16">
        <div className="mb-8">
          <PortfolioSearchBar initialKeyword={query.keyword} onSubmit={handleSearchSubmit} />
        </div>

        <div className="mb-8">
          <PortfolioTypeFilter selectedTypes={query.selectedTypes} onChange={handleTypesChange} />
        </div>

        <div className="space-y-8">
          <PortfolioPageHeader
            totalCount={totalElements}
            sort={query.sort}
            onSortChange={handleSortChange}
            keyword={query.keyword}
          />

          <PortfolioList
            portfolios={data?.content ?? []}
            isLoading={isLoading}
            error={error}
            hasKeyword={Boolean(query.keyword)}
          />

          {!isLoading && !error && totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination
                currentPage={query.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
