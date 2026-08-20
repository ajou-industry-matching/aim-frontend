"use client";

import { Loading } from "@/shared/ui/loading";

// 검색어를 들고 들어온 전환에서만 전체화면(물결 아치) 로딩을 쓴다.
// useSearchParams는 이 fallback을 띄운 장본인이라 여기서 쓸 수 없어 location으로 직접 확인한다.
export function PortfolioRouteFallback(): React.ReactElement {
  const hasKeyword =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("keyword");

  if (hasKeyword) {
    return <Loading isFullScreen text="포트폴리오를 검색하고 있어요" size="large" />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <Loading text="불러오는 중" size="large" />
    </div>
  );
}
