"use client";

import { useState, type ReactElement, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, toNavUser, useAuthSession, useSessionAdminMode } from "@/lib/auth";
import { MyPortfolioModal } from "@/screens/my-portfolio";
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
const routeOwnedNavigationPrefixes = ["/home"];

export const AppLayout = ({ children }: AppLayoutProps): ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isAuthReady } = useAuthSession();
  const shouldRenderNavigation =
    !headerlessRoutes.has(pathname) &&
    !pathname.startsWith("/admin") &&
    !routeOwnedNavigationPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  const navigationUser = toNavUser(session) ?? undefined;
  const { isAdminMode, toggleAdminMode } = useSessionAdminMode();
  const [isMyPortfolioOpen, setIsMyPortfolioOpen] = useState(false);

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
          isAdminMode={isAdminMode}
          logoHref="/home"
          onLogin={handleLoginClick}
          onSignup={handleSignupClick}
          onLogout={handleLogoutClick}
          onProfileClick={() => router.push("/profile")}
          // 크롤링 프로젝트 가져오기는 백엔드에서 학생만 허용한다.
          onMyPortfolioClick={
            session?.role === "STUDENT" ? () => setIsMyPortfolioOpen(true) : undefined
          }
          onAdminToggle={toggleAdminMode}
          onAdminDashboardClick={() => router.push("/admin")}
        />
      )}
      {children}
      {isMyPortfolioOpen && <MyPortfolioModal onClose={() => setIsMyPortfolioOpen(false)} />}
    </>
  );
};
