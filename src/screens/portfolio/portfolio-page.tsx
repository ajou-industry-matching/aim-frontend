"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isReady: isAuthReady } = useAuthReady();
  const urlKeyword = searchParams.get("keyword") ?? "";
  const [query, setQuery] = useState<PortfolioQuery>({
    page: 1,
    sort: "LATEST",
    keyword: urlKeyword,
    selectedTypes: [],
  });
  const [result, setResult] = useState<PortfolioFetchResult | null>(null);

  const queryKey = toPortfolioQueryKey(query);
  const hasMatchingResult = result?.queryKey === queryKey;
  const isLoading = !isAuthReady || !hasMatchingResult;
  const data = hasMatchingResult ? result.data : undefined;
  const error = hasMatchingResult ? (result.error ?? null) : null;

  useEffect(() => {
    setQuery((previous) =>
      previous.keyword === urlKeyword && previous.page === 1
        ? previous
        : { ...previous, keyword: urlKeyword, page: 1 },
    );
  }, [urlKeyword]);

  useEffect(() => {
    if (!isAuthReady) return;

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
  }, [isAuthReady, queryKey]);

  const handleSearchSubmit = (nextKeyword: string) => {
    const keyword = nextKeyword.trim();
    const nextParams = new URLSearchParams(searchParams.toString());

    if (keyword) {
      nextParams.set("keyword", keyword);
    } else {
      nextParams.delete("keyword");
    }

    const nextQueryString = nextParams.toString();
    const nextHref = nextQueryString ? `/portfolio?${nextQueryString}` : "/portfolio";

    if (keyword === urlKeyword) {
      setQuery((previous) => ({ ...previous, page: 1 }));
    }
    router.push(nextHref);
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
