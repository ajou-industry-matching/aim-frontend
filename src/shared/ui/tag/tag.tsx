import React from "react";
import { XIcon } from "@/shared/ui/icons";

export interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ children, onRemove, className = "" }) => {
  const classes = [
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium whitespace-nowrap select-none",
    "bg-[var(--color-primary-50)] text-[var(--color-primary-800)] border border-[var(--color-primary-200)]",
    "transition-colors duration-200",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={
            typeof children === "string" || typeof children === "number"
              ? `${children} 태그 삭제`
              : "태그 삭제"
          }
          className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[var(--color-primary-600)] hover:bg-[var(--color-primary-200)] hover:text-[var(--color-primary-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)] transition-colors duration-150 cursor-pointer"
        >
          <XIcon size={12} />
        </button>
      )}
    </span>
  );
};
