import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/ui/button/button";
import { UserIcon, LogOutIcon } from "@/shared/ui/icons";

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface User {
  name: string;
  email: string;
  userType: "학생" | "기업" | "교수";
  isAdmin?: boolean;
}

export interface NavigationProps {
  items: NavItem[];
  user?: User;
  isAdminMode?: boolean;
  onAdminToggle?: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onAdminDashboardClick?: () => void;
  logoHref?: string;
  className?: string;
}

export const Navigation = ({
  items,
  user,
  isAdminMode = false,
  onAdminToggle,
  onLogin,
  onSignup,
  onLogout,
  onProfileClick,
  onAdminDashboardClick,
  logoHref = "/",
  className = "",
}: NavigationProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const headerClasses = [
    "sticky top-0 z-50 h-[80px] bg-white/95 backdrop-blur-[6px] border-b border-[var(--color-gray-200,#e5e5ec)] w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const navLinkClasses = (isActive?: boolean) => {
    const base =
      "flex items-center justify-center py-[10px] text-[16px] leading-[1.5] tracking-[-0.4px] text-[var(--color-gray-900,#1a1a1a)] transition-all duration-200 border-b-2 h-full";
    const activeState = isActive
      ? "border-[var(--color-primary-800,#004a9c)] font-medium"
      : "border-transparent hover:border-[var(--color-primary-800,#004a9c)]/50 font-medium";
    return `${base} ${activeState}`;
  };

  return (
    <header className={headerClasses}>
      <div className="mx-auto max-w-[1440px] h-full flex items-center justify-between">
        {/* Logo Section */}
        <a href={logoHref} className="flex items-center gap-[6px] shrink-0">
          <div className="relative h-8 w-8">
            <img
              src="/assets/ajou-logo.svg"
              alt="AJOU Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-semibold text-2xl text-[var(--color-gray-900,#111)] tracking-[-0.6px] leading-[1.33]">
            AIM AJOU
          </span>
        </a>

        {/* Navigation Menu */}
        <nav className="flex items-center gap-12 h-full">
          {items.map((item) => (
            <a key={item.href} href={item.href} className={navLinkClasses(item.isActive)}>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Section: Auth & User Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Admin Mode Toggle */}
          {user?.isAdmin && onAdminToggle && (
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-[var(--color-gray-600,#666)] font-medium">
                {isAdminMode ? "관리 모드" : "일반 모드"}
              </span>
              <button
                onClick={onAdminToggle}
                className={`relative inline-flex h-[24px] w-[44px] items-center rounded-full transition-colors duration-300 ease-in-out ${
                  isAdminMode
                    ? "bg-[var(--color-primary-800,#004a9c)]"
                    : "bg-[var(--color-gray-200,#e5e5ec)]"
                }`}
                aria-label="관리자 모드 토글"
              >
                <span
                  className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out ${
                    isAdminMode ? "translate-x-[23px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-3 relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center justify-center h-10 w-10 text-[var(--color-primary-800,#004a9c)] hover:bg-[var(--color-primary-50)] rounded-full transition-all duration-200"
                aria-label="사용자 프로필"
              >
                <UserIcon size={24} />
              </button>

              {/* Logout Button: 유저 아이콘과 동일한 호버 스타일 적용 */}
              <button
                onClick={onLogout}
                className="flex items-center justify-center h-10 w-10 text-[var(--color-primary-800,#004a9c)] hover:bg-[var(--color-primary-50)] rounded-full transition-all duration-200"
                aria-label="로그아웃"
              >
                <LogOutIcon size={24} />
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute top-[55px] right-0 w-[280px] bg-white border border-[var(--color-gray-200,#e5e5ec)] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-5">
                    <div className="mb-4 pb-4 border-b border-[var(--color-gray-100,#f2f2f2)]">
                      <h3 className="text-[16px] font-bold text-[var(--color-gray-900,#111)] mb-1">
                        {user.name}
                      </h3>
                      <p className="text-[14px] text-[var(--color-gray-600,#666)] mb-3">
                        {user.email}
                      </p>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-800,#004a9c)] text-[12px] font-semibold">
                        {user.userType}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      {isAdminMode && onAdminDashboardClick && (
                        <button
                          onClick={() => {
                            onAdminDashboardClick();
                            setShowProfile(false);
                          }}
                          className="text-left px-3 py-2.5 text-[14px] text-[var(--color-primary-800,#004a9c)] font-medium hover:bg-[var(--color-primary-50)] rounded-md transition-colors"
                        >
                          관리자 대시보드
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onProfileClick?.();
                          setShowProfile(false);
                        }}
                        className="text-left px-3 py-2.5 text-[14px] text-[var(--color-gray-900,#1a1a1a)] hover:bg-[var(--color-gray-100)] rounded-md transition-colors"
                      >
                        내 프로필
                      </button>
                      <button
                        onClick={() => setShowProfile(false)}
                        className="text-left px-3 py-2.5 text-[14px] text-[var(--color-gray-900,#1a1a1a)] hover:bg-[var(--color-gray-100)] rounded-md transition-colors"
                      >
                        내 포트폴리오
                      </button>
                      <button
                        onClick={() => setShowProfile(false)}
                        className="text-left px-3 py-2.5 text-[14px] text-[var(--color-gray-900,#1a1a1a)] hover:bg-[var(--color-gray-100)] rounded-md transition-colors"
                      >
                        계정 설정
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="medium" onClick={onSignup}>
                회원가입
              </Button>
              <Button variant="primary" size="medium" onClick={onLogin} className="px-6">
                로그인
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Navigation.displayName = "Navigation";
