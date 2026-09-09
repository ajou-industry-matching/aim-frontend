"use client";

import { Loading, PageLoading } from "@/shared/ui/loading";

/**
 * 목록 화면이 `useSearchParams`로 서스펜드되는 동안 보여줄 로딩.
 * 홈 검색으로 넘어온 경우에는 결과 화면과 같은 덮개를 써서 로딩이 두 번 보이지 않게 한다.
 * (이 컴포넌트 자체가 Suspense fallback이라 `useSearchParams`를 쓸 수 없어 location으로 확인한다.)
 */
export function PortfolioRouteLoading(): React.ReactElement {
  const hasKeyword =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("keyword");

  if (!hasKeyword) return <PageLoading />;

  return (
    <Loading
      isFullScreen
      hasEnterAnimation={false}
      text="포트폴리오를 검색하고 있어요"
      size="large"
    />
  );
}
