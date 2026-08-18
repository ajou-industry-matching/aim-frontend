"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRoute(): null {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/notices");
  }, [router]);

  return null;
}
