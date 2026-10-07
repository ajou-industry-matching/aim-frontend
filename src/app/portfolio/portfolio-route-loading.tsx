"use client";

import { useSyncExternalStore } from "react";
import { PageLoading, SearchCoverLoading } from "@/shared/ui/loading";

// fallback이 떠 있는 동안 URL은 바뀌지 않으므로 구독할 변경이 없다.
const subscribeNoop = () => () => {};
const getHasKeyword = () => new URLSearchParams(window.location.search).has("keyword");
// 정적 export 프리렌더 시점에는 URL을 알 수 없으므로 검색어 없음으로 본다.
const getServerHasKeyword = () => false;

/**
 * 목록 화면이 `useSearchParams`로 서스펜드되는 동안 보여줄 로딩.
 * 홈 검색으로 넘어온 경우에는 결과 화면과 같은 덮개를 써서 로딩이 두 번 보이지 않게 한다.
 * (이 컴포넌트 자체가 Suspense fallback이라 `useSearchParams`를 쓸 수 없어 location으로 확인한다.)
 * 렌더 중에 `window`를 직접 읽으면 프리렌더 HTML과 하이드레이션 첫 렌더가 달라지므로
 * `useSyncExternalStore`로 서버 값을 맞춘 뒤 클라이언트 값으로 전환한다.
 */
export function PortfolioRouteLoading(): React.ReactElement {
  const hasKeyword = useSyncExternalStore(subscribeNoop, getHasKeyword, getServerHasKeyword);

  return hasKeyword ? <SearchCoverLoading /> : <PageLoading />;
}
