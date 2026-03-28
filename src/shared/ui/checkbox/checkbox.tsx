import React from "react";
import { CheckIcon } from "@/shared/ui/icons";

// --- Types ---
export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

// --- Styles ---

const containerBaseClasses = "inline-flex items-center gap-2 cursor-pointer group select-none";

// 1. 체크박스 박스 스타일 (peer 상태에 반응)
// 내부 아이콘(&>svg)의 스케일과 투명도를 peer-checked 상태일 때 조절합니다.
const boxClasses =
  "w-5 h-5 flex items-center justify-center rounded border transition-all duration-200 ease-out shrink-0 " +
  "peer-checked:bg-[var(--color-primary-800,#004A9C)] peer-checked:border-[var(--color-primary-800,#004A9C)] " +
  "peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:opacity-100 " + // 내부 SVG 제어
  "peer-disabled:bg-[var(--color-gray-100,#F2F2F2)] peer-disabled:border-[var(--color-gray-200,#E5E5E5)] " +
  "bg-white border-[var(--color-gray-300,#CCCCCC)] group-hover:peer-not-checked:border-[var(--color-primary-500,#3385DB)]";

// 2. 체크 아이콘 기본 스타일 (숨겨진 상태)
const iconClasses = "text-white transition-all duration-200 transform scale-0 opacity-0";

// 3. 라벨 스타일
const labelClasses = (disabled?: boolean) => {
  const base = "text-[14px] leading-[1.43] tracking-[-0.35px] transition-colors duration-200";
  const status = disabled
    ? "text-[var(--color-gray-400,#999)]"
    : "text-[var(--color-gray-800,#333)]";
  return `${base} ${status}`;
};

// --- Component ---

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, disabled, className = "", ...props }, ref) => {
    return (
      <label className={[containerBaseClasses, className].join(" ")}>
        <input type="checkbox" ref={ref} disabled={disabled} className="peer sr-only" {...props} />
        <div className={boxClasses}>
          {/* 부모 div의 peer-checked 클래스가 이 아이콘의 scale/opacity를 조절합니다 */}
          <CheckIcon size={14} className={iconClasses} />
        </div>
        {label && <span className={labelClasses(disabled)}>{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
