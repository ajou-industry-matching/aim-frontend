import { Suspense } from "react";
import { AdminPortfolioEditRoute } from "@/screens/admin";
import { PageLoading } from "@/shared/ui/loading";

export default function AdminPortfolioEditRoutePage(): React.ReactElement {
  return (
    <Suspense fallback={<PageLoading />}>
      <AdminPortfolioEditRoute />
    </Suspense>
  );
}
