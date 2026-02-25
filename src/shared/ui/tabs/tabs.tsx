import React from "react";

// ----------------------------------------------------------------------
// 1. Types & Interfaces
// ----------------------------------------------------------------------
export type TabVariant = "horizontal" | "vertical" | "pill";

export interface TabItem {
  id: string;
  label: string;
  badge?: React.ReactNode; // 뱃지 컴포넌트 또는 숫자
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value: string; // 현재 선택된 Tab의 ID
  onChange: (id: string) => void;
  variant?: TabVariant;
  className?: string;
}

// ----------------------------------------------------------------------
// 2. Style Tokens (Constants)
// ----------------------------------------------------------------------

// A. Container Styles
const containerBase = "flex";

const containerVariants: Record<TabVariant, string> = {
  horizontal:
    "w-full h-[48px] flex-row gap-0 border-b-[2px] border-[color:var(--color-gray-200,#E5E5E5)] p-0",
  vertical: "w-[200px] flex-col gap-1 p-2 h-auto", // Gap: 4px -> gap-1
  pill: "w-fit flex-row gap-2 p-1 bg-[color:var(--color-gray-100,#F2F2F2)] rounded-lg", // Gap: 8px -> gap-2, Padding: 4px -> p-1
};

// B. Tab Item Styles
const itemBase =
  "relative flex items-center justify-center cursor-pointer transition-all duration-200 outline-none select-none whitespace-nowrap";

const itemVariants: Record<TabVariant, string> = {
  horizontal: "h-[48px] px-6 gap-2 text-[14px] leading-[20px]", // Padding: 12px 24px -> px-6, Gap: 8px -> gap-2
  vertical:
    "h-[40px] px-4 gap-2 text-[14px] leading-[20px] rounded-[6px] border-l-[3px] justify-start", // Padding: 10px 16px -> px-4
  pill: "h-[32px] px-4 gap-2 text-[14px] font-medium rounded-[6px]", // Padding: 6px 16px -> px-4
};

// ----------------------------------------------------------------------
// 3. Helper Function (Class Assembler)
// ----------------------------------------------------------------------
const getTabItemClasses = (variant: TabVariant, isActive: boolean, isDisabled: boolean) => {
  const base = itemBase;
  const variantStyle = itemVariants[variant];
  let stateStyle = "";

  if (isDisabled) {
    stateStyle = "text-[color:var(--color-gray-300,#CCCCCC)] cursor-not-allowed";
  } else {
    switch (variant) {
      case "horizontal":
        // Hover: Label #333333, BG #F9F9F9
        // Active: Label #004A9C, Weight 600
        stateStyle = isActive
          ? "text-[color:var(--color-primary-800,#004A9C)] font-[600]"
          : "text-[color:var(--color-gray-600,#666666)] font-[500] hover:bg-[color:var(--color-gray-50,#F9F9F9)] hover:text-[#333333]";
        break;

      case "vertical":
        // Active: BG #F0F6FD, Border-L #004A9C, Label #004A9C
        stateStyle = isActive
          ? "bg-[color:var(--color-primary-50,#F0F6FD)] border-[color:var(--color-primary-800,#004A9C)] text-[color:var(--color-primary-800,#004A9C)] font-medium"
          : "border-transparent text-[color:var(--color-gray-900,#1A1A1A)] hover:bg-[color:var(--color-gray-50,#F9F9F9)]";
        break;

      case "pill":
        // Active: BG #FFFFFF, Shadow, Color #004A9C
        stateStyle = isActive
          ? "bg-white text-[color:var(--color-primary-800,#004A9C)] shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
          : "text-[color:var(--color-gray-600,#666666)] hover:text-[color:var(--color-gray-900,#1A1A1A)]";
        break;
    }
  }

  return [base, variantStyle, stateStyle].filter(Boolean).join(" ");
};

// ----------------------------------------------------------------------
// 4. Component Definition
// ----------------------------------------------------------------------
export const Tabs = ({
  items,
  value,
  onChange,
  variant = "horizontal",
  className = "",
}: TabsProps) => {
  const containerClass = [containerBase, containerVariants[variant], className].join(" ");

  return (
    <div className={containerClass} role="tablist">
      {items.map((item) => {
        const isActive = value === item.id;
        const isDisabled = !!item.disabled;

        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(item.id)}
            className={getTabItemClasses(variant, isActive, isDisabled)}
          >
            {/* Label */}
            <span>{item.label}</span>

            {/* Badge (Optional) */}
            {item.badge && (
              <span className="ml-[6px] inline-flex items-center justify-center">{item.badge}</span>
            )}

            {/* Active Indicator (Only for Horizontal) */}
            {variant === "horizontal" && isActive && !isDisabled && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[color:var(--color-primary-800,#004A9C)] transition-all duration-200" />
            )}
          </button>
        );
      })}
    </div>
  );
};

Tabs.displayName = "Tabs";
