import React from "react";

export type StatusBadgeStatus = "active" | "inactive" | "warning" | "error";

export interface StatusBadgeProps {
  status?: StatusBadgeStatus;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusBadgeStatus, { dot: string; text: string; bg: string }> = {
  active: {
    dot: "bg-[var(--color-success-500)]",
    text: "text-[var(--color-success-700)]",
    bg: "bg-[var(--color-success-100)]",
  },
  inactive: {
    dot: "bg-[var(--color-gray-400)]",
    text: "text-[var(--color-gray-600)]",
    bg: "bg-[var(--color-gray-100)]",
  },
  warning: {
    dot: "bg-[var(--color-warning-500)]",
    text: "text-[var(--color-warning-700)]",
    bg: "bg-[var(--color-warning-100)]",
  },
  error: {
    dot: "bg-[var(--color-error-500)]",
    text: "text-[var(--color-error-700)]",
    bg: "bg-[var(--color-error-100)]",
  },
};

const defaultLabels: Record<StatusBadgeStatus, string> = {
  active: "활성",
  inactive: "비활성",
  warning: "주의",
  error: "오류",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = "active",
  label,
  className = "",
}) => {
  const config = statusConfig[status];
  const displayLabel = label ?? defaultLabels[status];

  const classes = [
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap select-none",
    config.bg,
    config.text,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {displayLabel}
    </span>
  );
};
