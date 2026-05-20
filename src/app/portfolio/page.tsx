import { Suspense } from "react";
import { PortfolioPage } from "@/screens/portfolio";

export default function PortfolioRoute(): React.ReactElement {
  return (
    <Suspense>
      <PortfolioPage />
    </Suspense>
  );
}
