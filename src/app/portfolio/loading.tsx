import { PortfolioRouteFallback } from "./route-fallback";

// 루트 loading.tsx보다 이 세그먼트가 우선한다. 검색 전환일 때만 물결 아치가 나오도록 위임.
export default function PortfolioLoading(): React.ReactElement {
  return <PortfolioRouteFallback />;
}
