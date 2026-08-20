"use client";

import type { ReactElement, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, toNavUser, useAuthSession } from "@/lib/auth";
import { useSearchTransitionStore } from "@/lib/navigation";
import { Navigation, type NavItem } from "@/shared/ui";
import { Loading } from "@/shared/ui/loading";

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

const navigationItems: NavItem[] = [
  { label: "포트폴리오", href: "/portfolio" },
  { label: "소개", href: "/about" },
  { label: "공지사항", href: "/notice" },
];

const headerlessRoutes = new Set(["/"]);
const routeOwnedNavigationPrefixes = ["/home"];

export const AppLayout = ({ children }: AppLayoutProps): ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isAuthReady } = useAuthSession();
  const isSearchTransition = useSearchTransitionStore((state) => state.isActive);
  const shouldRenderNavigation =
    !headerlessRoutes.has(pathname) &&
    !pathname.startsWith("/admin") &&
    !routeOwnedNavigationPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  const navigationUser = toNavUser(session) ?? undefined;

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignupClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = async () => {
    try {
      await signOut();
    } finally {
      router.replace("/login");
    }
  };

  return (
    <>
      {shouldRenderNavigation && (
        <Navigation
          items={navigationItems}
          currentPathname={pathname}
          user={navigationUser}
          isAuthLoading={!isAuthReady}
          logoHref="/home"
          onLogin={handleLoginClick}
          onSignup={handleSignupClick}
          onLogout={handleLogoutClick}
          onProfileClick={() => router.push("/profile")}
        />
      )}
      {children}
      {/* 검색 전환 덮개. 레이아웃은 라우트가 바뀌어도 리마운트되지 않으므로
          홈에서 덮은 아치가 결과 화면까지 끊김 없이 이어진다. */}
      {isSearchTransition && (
        <Loading isFullScreen text="포트폴리오를 검색하고 있어요" size="large" />
      )}
    </>
  );
};
