"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, toNavUser, useAuthSession } from "@/lib/auth";
import { Navigation, Footer } from "@/shared/ui";
import { Spinner } from "@/shared/ui/spinner/spinner";
import { AdminSidebar } from "@/screens/admin";
import type { NavItem } from "@/shared/ui";

const navItems: NavItem[] = [
  { label: "포트폴리오", href: "/portfolio" },
  { label: "소개", href: "/about" },
  { label: "공지사항", href: "/notice" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, isAuthReady } = useAuthSession();
  const authUser = toNavUser(session);
  const isAdmin = authUser?.isAdmin ?? false;

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  // 미인증 → 로그인, 관리자 아님 → 홈으로 리다이렉트 (정적 export 환경이라 UI 노출 방지가 목적, 실제 권한은 백엔드가 검증)
  useEffect(() => {
    if (!isAuthReady) return;
    if (!session) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/");
    }
  }, [isAuthReady, session, isAdmin, router]);

  if (!isAuthReady || !session || !isAdmin) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-gray-50"
        role="status"
        aria-label="불러오는 중"
      >
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navigation
        items={navItems}
        user={authUser ?? undefined}
        onLogin={() => router.push("/login")}
        onSignup={() => router.push("/login")}
        onLogout={() => void handleLogout()}
      />
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-360 border-x border-neutral-200 bg-neutral-50">
        <AdminSidebar />
        <main className="flex flex-1 overflow-auto">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
