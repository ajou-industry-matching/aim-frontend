"use client";

import { useRouter } from "next/navigation";
import { signOut, useAuthUser } from "@/lib/auth";
import { Navigation } from "@/shared/ui";
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

      <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-10 md:px-16">
        <div className="mx-auto max-w-360">
          <div className="mb-6 flex justify-center gap-6 text-[13px] text-gray-500">
            <a href="/terms" className="transition-colors hover:text-gray-900">
              이용약관
            </a>
            <a href="/privacy" className="transition-colors hover:text-gray-900">
              개인정보처리방침
            </a>
            <a href="/sitemap" className="transition-colors hover:text-gray-900">
              사이트맵
            </a>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/ajou-logo.svg"
                alt="Ajou University"
                className="h-10 w-10 object-contain"
              />
              <div>
                <p className="text-[14px] font-bold text-gray-900">아주대학교</p>
                <p className="text-[11px] text-gray-400">AJOU University</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-[12px] text-gray-500 md:text-center">
              <p>16499 경기도 수원시 영통구 월드컵로 206 아주대학교</p>
              <p>T. 031-219-2114</p>
              <p>Copyright © 2026 Ajou University. All Rights Reserved.</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-(--color-primary-800) hover:text-(--color-primary-800)"
                aria-label="인스타그램"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-(--color-primary-800) hover:text-(--color-primary-800)"
                aria-label="페이스북"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-(--color-primary-800) hover:text-(--color-primary-800)"
                aria-label="유튜브"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
