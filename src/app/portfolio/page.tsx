import { Suspense } from "react";
import { PortfolioListPage } from "@/screens/portfolio";

export default function PortfolioRoute(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-(--color-primary-800)" />
        </div>
      }
    >
      <PortfolioListPage />
    </Suspense>
  );
}
