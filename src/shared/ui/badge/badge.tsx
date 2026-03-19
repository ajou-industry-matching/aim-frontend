import React from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "outlined";
export type BadgeSize = "small" | "medium" | "large";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-[var(--color-primary-100)] text-[var(--color-primary-800)]",
  secondary: "bg-[var(--color-gray-100)] text-[var(--color-gray-700)]",
  success: "bg-[var(--color-success-100)] text-[var(--color-success-700)]",
  warning: "bg-[var(--color-warning-100)] text-[var(--color-warning-700)]",
  error: "bg-[var(--color-error-100)] text-[var(--color-error-700)]",
  info: "bg-[var(--color-info-100)] text-[var(--color-info-700)]",
  outlined: "bg-transparent border border-[var(--color-gray-300)] text-[var(--color-gray-700)]",
};

const sizeClasses: Record<BadgeSize, string> = {
  small: "px-2 py-0.5 text-[11px] leading-[16px] gap-1 rounded-[4px]",
  medium: "px-2.5 py-1 text-[12px] leading-[18px] gap-1 rounded-[6px]",
  large: "px-3 py-1.5 text-[13px] leading-[20px] gap-1.5 rounded-[6px]",
};

const iconSizeClasses: Record<BadgeSize, string> = {
  small: "[&>svg]:w-3 [&>svg]:h-3",
  medium: "[&>svg]:w-3.5 [&>svg]:h-3.5",
  large: "[&>svg]:w-4 [&>svg]:h-4",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  size = "medium",
  icon,
  children,
  className = "",
}) => {
  const classes = [
    "inline-flex items-center font-medium whitespace-nowrap select-none",
    variantClasses[variant],
    sizeClasses[size],
    iconSizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {icon && icon}
      {children}
    </span>
  );
};
