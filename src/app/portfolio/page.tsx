import { Suspense } from "react";
import { PortfolioListPage } from "@/screens/portfolio";
import { PortfolioRouteFallback } from "./route-fallback";

export default function PortfolioRoute(): React.ReactElement {
  return (
    <Suspense fallback={<PortfolioRouteFallback />}>
      <PortfolioListPage />
    </Suspense>
  );
}
