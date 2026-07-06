import { Suspense } from "react";
import { PortfolioDetailRoute } from "@/screens/portfolio-detail";

export default function PortfolioDetailRoutePage(): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <PortfolioDetailRoute />
    </Suspense>
  );
}
