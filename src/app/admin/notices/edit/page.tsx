import { Suspense } from "react";
import { AdminNoticesEditRoute } from "@/screens/admin";
import RouteLoading from "@/app/loading";

export default function AdminNoticesEditRoutePage(): React.ReactElement {
  return (
    <Suspense fallback={<RouteLoading />}>
      <AdminNoticesEditRoute />
    </Suspense>
  );
}
