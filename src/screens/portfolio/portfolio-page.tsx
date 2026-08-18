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
import { Footer, Pagination } from "@/shared/ui";
import { PortfolioList } from "./portfolio-list";
import { PortfolioPageHeader } from "./portfolio-page-header";
import { PortfolioSearchBar } from "./portfolio-search-bar";
import { PortfolioTypeFilter } from "./portfolio-type-filter";

const PORTFOLIO_PAGE_SIZE = 12;
const GENERIC_FETCH_ERROR_MESSAGE = "잠시 후 다시 시도해주세요.";

type PortfolioQuery = {
  page: number;
  sort: PortfolioSort;
  selectedTypes: PortfolioBoardType[];
};

type PortfolioFetchResult = {
  queryKey: string;
  data?: PortfolioListPageResponse;
  error?: string;
};

const toPortfolioQueryKey = (
  { page, sort, selectedTypes }: PortfolioQuery,
  keyword: string,
): string => `${page}|${sort}|${keyword}|${[...selectedTypes].sort().join(",")}`;

export const PortfolioListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isReady: isAuthReady } = useAuthReady();
  const urlKeyword = searchParams.get("keyword") ?? "";
  const keyword = urlKeyword.trim();
  const [lastKeyword, setLastKeyword] = useState(keyword);
  const [query, setQuery] = useState<PortfolioQuery>({
    page: 1,
    sort: "LATEST",
    selectedTypes: [],
  });
  const [result, setResult] = useState<PortfolioFetchResult | null>(null);

  // keyword가 바뀐 렌더에서 즉시 page를 1로 반영한다(ref 대신 state로 렌더 중 조정 — React 권장 패턴).
  if (lastKeyword !== keyword) {
    setLastKeyword(keyword);
    setQuery((previous) => (previous.page === 1 ? previous : { ...previous, page: 1 }));
  }

  const effectiveQuery = lastKeyword === keyword ? query : { ...query, page: 1 };
  const queryKey = toPortfolioQueryKey(effectiveQuery, keyword);
  const hasMatchingResult = result?.queryKey === queryKey;
  // 비로그인도 조회 가능. 인증 상태가 확정(isReady)되면 조회한다.
  const isLoading = !isAuthReady || !hasMatchingResult;
  const data = hasMatchingResult ? result.data : undefined;
  const error = hasMatchingResult ? (result.error ?? null) : null;

  useEffect(() => {
    if (!isAuthReady) return;

    let isCancelled = false;
    const pageable = {
      page: effectiveQuery.page - 1,
      size: PORTFOLIO_PAGE_SIZE,
      sort: effectiveQuery.sort,
      boardTypes: effectiveQuery.selectedTypes,
    };
    const request = keyword
      ? searchPortfolios({ ...pageable, keyword })
      : getPortfolioList(pageable);

    request
      .then((response) => {
        if (isCancelled) return;
        setResult({ queryKey, data: response });
      })
      .catch((cause: unknown) => {
        console.error("Failed to fetch portfolios", cause);
        if (isCancelled) return;
        setResult({ queryKey, error: GENERIC_FETCH_ERROR_MESSAGE });
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
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-16">
          <div className="mb-8">
            <PortfolioSearchBar initialKeyword={keyword} onSubmit={handleSearchSubmit} />
          </div>

          <div className="mb-8">
            <PortfolioTypeFilter selectedTypes={query.selectedTypes} onChange={handleTypesChange} />
          </div>

          <div className="space-y-8">
            <PortfolioPageHeader
              totalCount={totalElements}
              sort={query.sort}
              onSortChange={handleSortChange}
              keyword={keyword}
            />

            <PortfolioList
              portfolios={data?.content ?? []}
              isLoading={isLoading}
              error={error}
              hasKeyword={Boolean(keyword)}
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
      <Footer className="mt-auto" />
    </div>
  );
};
