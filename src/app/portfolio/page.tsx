import { Suspense } from "react";
import { PortfolioListPage } from "@/screens/portfolio";
import RouteLoading from "@/app/loading";

export default function PortfolioRoute(): React.ReactElement {
  return (
    <Suspense fallback={<RouteLoading />}>
      <PortfolioListPage />
    </Suspense>
  );
}
