"use client";

import { useRouter } from "next/navigation";
import { signOut, useAuthUser } from "@/lib/auth";
import { Navigation, Footer } from "@/shared/ui";
import { AdminSidebar } from "@/screens/admin";
import type { NavItem } from "@/shared/ui";

const navItems: NavItem[] = [
  { label: "포트폴리오", href: "/portfolio" },
  { label: "소개", href: "#about" },
  { label: "공지사항", href: "#notice" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authUser = useAuthUser();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

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
