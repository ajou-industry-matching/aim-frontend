import { Suspense } from "react";
import { PortfolioListPage } from "@/screens/portfolio";

export default function PortfolioRoute(): React.ReactElement {
  return (
    <Suspense>
      <PortfolioListPage />
    </Suspense>
  );
}
