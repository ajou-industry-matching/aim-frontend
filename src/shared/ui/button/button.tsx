import React from "react";
import { Spinner } from "@/shared/ui/spinner/spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";
export type IconPosition = "left" | "right" | "none";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconPosition?: IconPosition;
  icon?: React.ReactNode;
  children?: React.ReactNode; // 버튼 텍스트 (없으면 IconButton으로 동작)
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string; //접근성 레이블 (children이 없을 때 필수)
}

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

    // 기본 클래스 토큰
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out cursor-pointer whitespace-nowrap select-none";

    // 크기별 클래스 토큰
    const sizeClasses = isIconOnly
      ? {
          small: "w-8 h-8 p-0",
          medium: "w-10 h-10 p-0",
          large: "w-12 h-12 p-0",
        }
      : {
          small: "h-8 px-4 text-[14px] leading-[20px] rounded-[6px] gap-1.5",
          medium: "h-10 px-6 text-[14px] leading-[20px] rounded-lg gap-2",
          large: "h-12 px-8 text-[16px] leading-[24px] rounded-lg gap-2",
        };

    const borderRadiusClass = isIconOnly ? "rounded-lg" : "";

    const variantClasses = {
      primary: {
        default:
          "bg-[var(--color-primary-800)] text-white hover:bg-[var(--color-primary-700)] hover:shadow-[0_4px_12px_rgba(0,74,156,0.2)] hover:scale-[1.02] active:bg-[var(--color-primary-900)] active:scale-[0.98] active:shadow-none disabled:opacity-60",
        disabled:
          "bg-[var(--color-gray-300)] text-[var(--color-gray-400)] cursor-not-allowed opacity-60",
        loading: "bg-[var(--color-primary-800)] text-white cursor-wait",
      },
      secondary: {
        default:
          "bg-transparent border-2 border-[var(--color-primary-800)] text-[var(--color-primary-800)] hover:bg-[var(--color-primary-50)] hover:border-[var(--color-primary-700)] hover:text-[var(--color-primary-700)] active:bg-[var(--color-primary-100)] active:border-[var(--color-primary-900)] active:text-[var(--color-primary-900)]",
        disabled:
          "bg-transparent border-2 border-[var(--color-gray-300)] text-[var(--color-gray-400)] cursor-not-allowed opacity-60",
        loading:
          "bg-transparent border-2 border-[var(--color-primary-800)] text-[var(--color-primary-800)] cursor-wait",
      },
      ghost: {
        default:
          "bg-transparent text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] active:bg-[var(--color-gray-200)]",
        disabled: "bg-transparent text-[var(--color-gray-400)] cursor-not-allowed opacity-60",
        loading: "bg-transparent text-[var(--color-gray-700)] cursor-wait",
      },
      danger: {
        default:
          "bg-[var(--color-error-500)] text-white hover:bg-[var(--color-error-700)] hover:shadow-[0_4px_12px_rgba(239,68,68,0.2)] hover:scale-[1.02] active:bg-[#991B1B] active:scale-[0.98] active:shadow-none",
        disabled:
          "bg-[var(--color-gray-300)] text-[var(--color-gray-400)] cursor-not-allowed opacity-60",
        loading: "bg-[var(--color-error-500)] text-white cursor-wait",
      },
    };

    // 상태별 클래스 토큰
    const getVariantClasses = () => {
      if (disabled && !isLoading) return variantClasses[variant].disabled;
      if (isLoading) return variantClasses[variant].loading;
      return variantClasses[variant].default;
    };

    const widthClass = fullWidth ? "w-full" : "w-auto";

    const iconSizeClasses = {
      small: "[&>svg]:w-4 [&>svg]:h-4",
      medium: "[&>svg]:w-5 [&>svg]:h-5",
      large: "[&>svg]:w-6 [&>svg]:h-6",
    };

    // 최종 className 조합
    const buttonClasses = [
      baseClasses,
      sizeClasses[size],
      borderRadiusClass,
      getVariantClasses(),
      widthClass,
      iconSizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClasses}
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
            {isLoading && <Spinner size="small" />}

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
