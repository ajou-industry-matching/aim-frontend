import { Suspense } from "react";
import { PortfolioEditRoute } from "@/screens/portfolio-edit";

export default function PortfolioEditRoutePage(): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <PortfolioEditRoute />
    </Suspense>
  );
}
