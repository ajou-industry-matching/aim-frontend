"use client";

import type { ReactElement, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, toNavUser, useAuthSession } from "@/lib/auth";
import { Navigation, type NavItem } from "@/shared/ui";

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

const navigationItems: NavItem[] = [
  { label: "포트폴리오", href: "/portfolio" },
  { label: "소개", href: "/about" },
  { label: "공지사항", href: "/notice" },
];

const headerlessRoutes = new Set(["/"]);
const routeOwnedNavigationPrefixes = ["/home", "/admin"];

export const AppLayout = ({ children }: AppLayoutProps): ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isAuthReady } = useAuthSession();
  const shouldRenderNavigation =
    !headerlessRoutes.has(pathname) &&
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
        />
      )}
      {children}
    </>
  );
};
