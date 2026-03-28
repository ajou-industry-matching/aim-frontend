import React from "react";

// ----------------------------------------------------------------------
// 1. 타입 및 인터페이스
// ----------------------------------------------------------------------
// 💡 배열 생략: 사용하지 않는 배열로 인한 ESLint 에러 방지 및 가이드라인(Literal Union) 준수
export type TabVariant = "horizontal" | "vertical" | "pill";

export type TabItem = {
  id: string;
  label: string;
  badge?: React.ReactNode;
  isDisabled?: boolean;
};

export type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  variant?: TabVariant;
  isAnimated?: boolean;
  className?: string;
};

// ----------------------------------------------------------------------
// 2. 스타일 토큰 (상수)
// ----------------------------------------------------------------------
const containerBaseClasses = "flex";

const containerVariantClasses: Record<TabVariant, string> = {
  horizontal:
    "w-full h-[48px] flex-row gap-0 border-b-[2px] border-[color:var(--color-gray-200,#E5E5E5)] p-0",
  vertical: "w-[200px] flex-col gap-1 p-2 h-auto",
  pill: "w-fit flex-row gap-2 p-1 bg-[color:var(--color-gray-100,#F2F2F2)] rounded-lg",
};

const itemBaseClasses =
  "relative flex items-center justify-center cursor-pointer transition-all duration-200 outline-none select-none whitespace-nowrap";

const itemVariantClasses: Record<TabVariant, string> = {
  horizontal: "h-[48px] px-6 gap-2 text-[14px] leading-[20px]",
  vertical:
    "h-[40px] px-4 gap-2 text-[14px] leading-[20px] rounded-[6px] border-l-[3px] justify-start",
  pill: "h-[32px] px-4 gap-2 text-[14px] font-medium rounded-[6px]",
};

// ----------------------------------------------------------------------
// 3. 헬퍼 함수 (클래스 조립)
// ----------------------------------------------------------------------
const getTabItemClasses = (
  variant: TabVariant,
  isActive: boolean,
  isDisabled: boolean,
  isAnimated: boolean,
): string => {
  const base = itemBaseClasses;
  const variantClasses = itemVariantClasses[variant];
  const motionClasses = isAnimated
    ? "transition-[color,background-color,transform] duration-300 ease-out"
    : "";
  let stateClasses = "";

  if (isDisabled) {
    stateClasses = "text-[color:var(--color-gray-300,#CCCCCC)] cursor-not-allowed";
  } else {
    switch (variant) {
      case "horizontal":
        stateClasses = isActive
          ? "text-[color:var(--color-primary-800,#004A9C)] font-[600]"
          : "text-[color:var(--color-gray-600,#666666)] font-[500] hover:bg-[color:var(--color-gray-50,#F9F9F9)] hover:text-[#333333]";
        break;
      case "vertical":
        stateClasses = isActive
          ? "bg-[color:var(--color-primary-50,#F0F6FD)] border-[color:var(--color-primary-800,#004A9C)] text-[color:var(--color-primary-800,#004A9C)] font-medium"
          : "border-transparent text-[color:var(--color-gray-900,#1A1A1A)] hover:bg-[color:var(--color-gray-50,#F9F9F9)]";
        break;
      case "pill":
        stateClasses = isActive
          ? "bg-white text-[color:var(--color-primary-800,#004A9C)] shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
          : "text-[color:var(--color-gray-600,#666666)] hover:text-[color:var(--color-gray-900,#1A1A1A)]";
        break;
    }
  }

  return [base, variantClasses, motionClasses, stateClasses].filter(Boolean).join(" ");
};

// ----------------------------------------------------------------------
// 4. 컴포넌트 정의
// ----------------------------------------------------------------------
export const Tabs = ({
  items,
  value,
  onChange,
  variant = "horizontal",
  isAnimated = false,
  className = "",
}: TabsProps): React.ReactElement => {
  const containerClasses = [containerBaseClasses, containerVariantClasses[variant], className].join(
    " ",
  );

  return (
    <div className={containerClasses} role="tablist">
      {items.map((item) => {
        const isActive = value === item.id;
        const isDisabled = !!item.isDisabled;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(item.id)}
            className={getTabItemClasses(variant, isActive, isDisabled, isAnimated)}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-[6px] inline-flex items-center justify-center">{item.badge}</span>
            )}
            {variant === "horizontal" && isAnimated && !isDisabled && (
              <div
                className={[
                  "absolute bottom-0 left-0 h-[2px] w-full origin-center bg-[color:var(--color-primary-800,#004A9C)] transition-transform duration-300 ease-out",
                  isActive ? "scale-x-100" : "scale-x-0",
                ].join(" ")}
              />
            )}
            {variant === "horizontal" && !isAnimated && isActive && !isDisabled && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[color:var(--color-primary-800,#004A9C)] transition-all duration-200" />
            )}
          </button>
        );
      })}
    </div>
  );
};

Tabs.displayName = "Tabs";
