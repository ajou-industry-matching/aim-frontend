import { Suspense } from "react";
import { PortfolioListPage } from "@/screens/portfolio";
import { PortfolioRouteLoading } from "./portfolio-route-loading";

export default function PortfolioRoute(): React.ReactElement {
  return (
    <Suspense fallback={<PortfolioRouteLoading />}>
      <PortfolioListPage />
    </Suspense>
  );
}
