import { Suspense } from "react";
import { AdminNoticesEditRoute } from "@/screens/admin";
import { PageLoading } from "@/shared/ui/loading";

export default function AdminNoticesEditRoutePage(): React.ReactElement {
  return (
    <Suspense fallback={<PageLoading />}>
      <AdminNoticesEditRoute />
    </Suspense>
  );
}
