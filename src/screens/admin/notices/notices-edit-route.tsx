"use client";

import { useSearchParams } from "next/navigation";
import { AdminNoticesEditPage } from "./notices-edit";

export const AdminNoticesEditRoute = (): React.ReactElement => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isValidId = id !== null && (id === "new" || /^\d+$/.test(id));

  if (!isValidId) {
    return (
      <div className="flex-1 bg-white p-8">
        <p className="py-16 text-center text-[14px] text-[#999]">잘못된 접근입니다.</p>
      </div>
    );
  }

  return <AdminNoticesEditPage id={id} />;
};
