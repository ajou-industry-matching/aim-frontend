"use client";

import type { ReactElement, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useAuthSession } from "@/lib/auth";
import type { BackendUser } from "@/api/auth";
import { Navigation, type NavItem, type NavUser } from "@/shared/ui";

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

const navigationItems: NavItem[] = [
  { label: "포트폴리오", href: "/portfolio" },
  { label: "소개", href: "/about" },
  { label: "공지사항", href: "/notice" },
];

const headerlessRoutes = new Set(["/"]);

// 세션 파싱(normalizeStoredSession)이 role을 STUDENT/PROFESSOR/COMPANY로 보장하므로
// 망라적 Record로 매핑한다. AuthRole에 새 역할이 추가되면 컴파일 에러로 누락을 잡는다.
const authRoleLabels: Record<BackendUser["role"], NavUser["userType"]> = {
  STUDENT: "학생",
  PROFESSOR: "교수",
  COMPANY: "기업",
};

export const AppLayout = ({ children }: AppLayoutProps): ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isAuthReady } = useAuthSession();
  const shouldRenderNavigation = !headerlessRoutes.has(pathname);
  const navigationUser: NavUser | undefined = session
    ? {
        name: session.name ?? session.email ?? "",
        email: session.email,
        userType: authRoleLabels[session.role],
        isAdmin: session.adminRole !== "NONE",
      }
    : undefined;

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
