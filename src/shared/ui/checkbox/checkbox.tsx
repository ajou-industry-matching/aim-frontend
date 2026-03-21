import React from "react";
import { CheckIcon } from "@/shared/ui/icons";

// --- Types ---
export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

// --- Styles ---

// 1. Container & Input
const containerBaseClasses = "inline-flex items-center gap-2 cursor-pointer group select-none";
const inputHiddenClasses = "sr-only"; // Screen reader only

// 2. Checkbox Box
const boxBaseClasses =
  "w-5 h-5 flex items-center justify-center rounded border transition-all duration-200 ease-out shrink-0";

const getBoxClasses = (checked?: boolean, disabled?: boolean) => {
  if (disabled) {
    return [
      boxBaseClasses,
      "bg-[var(--color-gray-100,#F2F2F2)] border-[var(--color-gray-200,#E5E5E5)]",
    ].join(" ");
  }
  if (checked) {
    return [
      boxBaseClasses,
      "bg-[var(--color-primary-800,#004A9C)] border-[var(--color-primary-800,#004A9C)]",
    ].join(" ");
  }
  return [
    boxBaseClasses,
    "bg-white border-[var(--color-gray-300,#CCCCCC)] group-hover:border-[var(--color-primary-500,#3385DB)]",
  ].join(" ");
};

// 3. Label
const labelBaseClasses =
  "text-[14px] leading-[1.43] tracking-[-0.35px] transition-colors duration-200";
const getLabelClasses = (disabled?: boolean) => {
  const statusClasses = disabled
    ? "text-[var(--color-gray-400,#999)]"
    : "text-[var(--color-gray-800,#333)]";
  return [labelBaseClasses, statusClasses].join(" ");
};

// --- Component ---

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, disabled, className = "", ...props }, ref) => {
    return (
      <label className={[containerBaseClasses, className].join(" ")}>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          className={inputHiddenClasses}
          {...props}
        />
        <div className={getBoxClasses(checked, disabled)}>
          <CheckIcon size={14} className={checked ? "text-white" : "text-transparent"} />
        </div>
        {label && <span className={getLabelClasses(disabled)}>{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
