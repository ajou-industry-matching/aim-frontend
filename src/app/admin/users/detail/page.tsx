import { Suspense } from "react";
import { AdminUserDetailRoute } from "@/screens/admin";
import { PageLoading } from "@/shared/ui/loading";

export default function AdminUserDetailRoutePage(): React.ReactElement {
  return (
    <Suspense fallback={<PageLoading />}>
      <AdminUserDetailRoute />
    </Suspense>
  );
}
