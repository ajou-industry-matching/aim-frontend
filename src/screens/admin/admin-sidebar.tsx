"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon, LayoutDashboardIcon, UserIcon } from "@/shared/ui/icons";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "대시보드", href: "/admin/dashboard", icon: <LayoutDashboardIcon size={16} /> },
  { label: "공지사항 관리", href: "/admin/notices", icon: <BellIcon size={16} /> },
  { label: "사용자 관리", href: "/admin/users", icon: <UserIcon size={16} /> },
];

const baseLinkClasses =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200";
const activeLinkClasses =
  "bg-[var(--color-primary-800,#004a9c)] text-white shadow-md shadow-[#004a9c]/20";
const inactiveLinkClasses =
  "text-neutral-600 hover:bg-(--color-primary-50) hover:text-[var(--color-primary-800,#004a9c)]";

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 space-y-4 border-r border-neutral-200 bg-neutral-50 p-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#111]">관리자 콘솔</h2>
        <p className="text-sm text-neutral-500">플랫폼 관리</p>
      </div>
      <nav className="space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[baseLinkClasses, isActive ? activeLinkClasses : inactiveLinkClasses].join(
                " ",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
