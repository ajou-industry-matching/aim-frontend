"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const BellIcon = () => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "공지사항 관리", href: "/admin/notices", icon: <BellIcon /> },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 bg-neutral-50 p-6">
      <p className="mb-4 text-lg font-semibold leading-tight tracking-normal text-[#111]">
        관리자 콘솔
      </p>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
        관리자 관리
      </p>
      <nav className="flex flex-col gap-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium leading-normal transition-colors",
                isActive
                  ? "bg-[#004a9c] text-white"
                  : "text-neutral-600 hover:bg-(--color-primary-50) hover:text-[#004a9c]",
              ].join(" ")}
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
