"use client";

import type { ReactElement, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
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

const normalizePathname = (pathname: string | null): string => {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "");
};

export const AppLayout = ({ children }: AppLayoutProps): ReactElement => {
  const router = useRouter();
  const pathname = normalizePathname(usePathname());
  const shouldRenderNavigation = !headerlessRoutes.has(pathname);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignupClick = () => {
    router.push("/login");
  };

  return (
    <>
      {shouldRenderNavigation && (
        <Navigation
          items={navigationItems}
          currentPathname={pathname}
          logoHref="/home"
          onLogin={handleLoginClick}
          onSignup={handleSignupClick}
        />
      )}
      {children}
    </>
  );
};
