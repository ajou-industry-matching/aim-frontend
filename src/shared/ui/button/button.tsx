import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";
export type IconPosition = "left" | "right" | "none";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconPosition?: IconPosition;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

// 로딩 스피너 컴포넌트
const LoadingSpinner: React.FC = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

LoadingSpinner.displayName = "LoadingSpinner";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      iconPosition = "none",
      icon,
      children,
      fullWidth = false,
      isLoading = false,
      disabled = false,
      className = "",
      onClick,
      ...props
    },
    ref,
  ) => {
    // children이 없으면 IconButton 모드
    const isIconOnly = !children && icon;

    // 개발 환경에서 경고 (접근성)
    if (process.env.NODE_ENV === "development" && isIconOnly && !props["aria-label"]) {
      console.warn("Button: 아이콘만 있는 버튼은 접근성을 위해 aria-label을 제공해야 합니다.");
    }

    // 기본 스타일 (font-family Pretendard 포함)
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out cursor-pointer whitespace-nowrap select-none";

    // 크기별 스타일 (명세서 정확히 반영)
    const sizeStyles = isIconOnly
      ? {
          // IconButton 스타일 (정사각형)
          small: "w-8 h-8 p-0",
          medium: "w-10 h-10 p-0",
          large: "w-12 h-12 p-0",
        }
      : {
          // 일반 Button 스타일
          small: "h-8 px-4 text-[14px] leading-[20px] rounded-[6px] gap-1.5",
          medium: "h-10 px-6 text-[14px] leading-[20px] rounded-lg gap-2",
          large: "h-12 px-8 text-[16px] leading-[24px] rounded-lg gap-2",
        };

    // Border radius (IconButton은 항상 rounded-lg)
    const borderRadiusStyle = isIconOnly ? "rounded-lg" : "";

    // 변형별 스타일 (명세서 색상 정확히 반영)
    const variantStyles = {
      primary: {
        default:
          "bg-[#004A9C] text-white hover:bg-[#0056B3] hover:shadow-[0_4px_12px_rgba(0,74,156,0.2)] hover:scale-[1.02] active:bg-[#003876] active:scale-[0.98] active:shadow-none disabled:opacity-60",
        disabled: "bg-[#CCCCCC] text-[#999999] cursor-not-allowed opacity-60",
        loading: "bg-[#004A9C] text-white cursor-wait",
      },
      secondary: {
        default:
          "bg-transparent border-2 border-[#004A9C] text-[#004A9C] hover:bg-[#F0F6FD] hover:border-[#0056B3] hover:text-[#0056B3] active:bg-[#E0EDFB] active:border-[#003876] active:text-[#003876]",
        disabled:
          "bg-transparent border-2 border-[#CCCCCC] text-[#999999] cursor-not-allowed opacity-60",
        loading: "bg-transparent border-2 border-[#004A9C] text-[#004A9C] cursor-wait",
      },
      ghost: {
        default: "bg-transparent text-[#4D4D4D] hover:bg-[#F2F2F2] active:bg-[#E5E5E5]",
        disabled: "bg-transparent text-[#999999] cursor-not-allowed opacity-60",
        loading: "bg-transparent text-[#4D4D4D] cursor-wait",
      },
      danger: {
        default:
          "bg-[#EF4444] text-white hover:bg-[#B91C1C] hover:shadow-[0_4px_12px_rgba(239,68,68,0.2)] hover:scale-[1.02] active:bg-[#991B1B] active:scale-[0.98] active:shadow-none",
        disabled: "bg-[#CCCCCC] text-[#999999] cursor-not-allowed opacity-60",
        loading: "bg-[#EF4444] text-white cursor-wait",
      },
    };

    // 상태에 따른 스타일 선택
    const getVariantStyle = () => {
      if (disabled && !isLoading) return variantStyles[variant].disabled;
      if (isLoading) return variantStyles[variant].loading;
      return variantStyles[variant].default;
    };

    // 전체 너비 스타일
    const widthStyle = fullWidth ? "w-full" : "w-auto";

    // 아이콘 크기 스타일
    const iconSizeStyles = {
      small: "[&>svg]:w-4 [&>svg]:h-4",
      medium: "[&>svg]:w-5 [&>svg]:h-5",
      large: "[&>svg]:w-6 [&>svg]:h-6",
    };

    // 최종 className 조합
    const buttonClassName = [
      baseStyles,
      sizeStyles[size],
      borderRadiusStyle,
      getVariantStyle(),
      widthStyle,
      iconSizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClassName}
        disabled={disabled || isLoading}
        onClick={onClick}
        {...props}
      >
        {/* IconButton 모드 (children 없음) */}
        {isIconOnly && !isLoading && icon}

        {/* 일반 Button 모드 (children 있음) */}
        {!isIconOnly && (
          <>
            {/* 로딩 상태 */}
            {isLoading && <LoadingSpinner />}

            {/* 왼쪽 아이콘 */}
            {!isLoading && iconPosition === "left" && icon && (
              <span className="inline-flex items-center justify-center">{icon}</span>
            )}

            {/* 버튼 텍스트 */}
            <span className="font-medium">{isLoading ? "처리 중..." : children}</span>

            {/* 오른쪽 아이콘 */}
            {!isLoading && iconPosition === "right" && icon && (
              <span className="inline-flex items-center justify-center">{icon}</span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
