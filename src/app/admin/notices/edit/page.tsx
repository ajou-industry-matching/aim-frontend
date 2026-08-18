import { Suspense } from "react";
import { AdminNoticesEditRoute } from "@/screens/admin";

export default function AdminNoticesEditRoutePage(): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <AdminNoticesEditRoute />
    </Suspense>
  );
}
