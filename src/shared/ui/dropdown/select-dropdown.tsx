import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "@/shared/ui/icons";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectDropdownProps {
  options: SelectOption[];
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  isFullWidth?: boolean;
  onChange?: (option: SelectOption) => void;
  className?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  value,
  placeholder = "선택해주세요",
  disabled = false,
  isFullWidth = false,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange?.(option);
    setIsOpen(false);
  };

  const triggerClasses = [
    "inline-flex items-center justify-between gap-2 px-4 h-10 rounded-lg border text-[14px] transition-colors focus:outline-none",
    isFullWidth ? "w-full" : "min-w-[160px]",
    disabled
      ? "bg-[color:var(--color-gray-100,#F2F2F2)] text-[color:var(--color-gray-400,#999999)] border-[color:var(--color-gray-200,#E5E5E5)] cursor-not-allowed"
      : isOpen
        ? "bg-white text-[color:var(--color-gray-900,#1A1A1A)] border-[color:var(--color-primary-500,#3385DB)] shadow-[0_0_0_3px_var(--color-primary-100,#E0EDFB)]"
        : "bg-white text-[color:var(--color-gray-900,#1A1A1A)] border-[color:var(--color-gray-300,#CCCCCC)] hover:border-[color:var(--color-primary-500,#3385DB)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={`relative ${isFullWidth ? "w-full" : "inline-block"}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={triggerClasses}
      >
        <span className={selectedOption ? "" : "text-[color:var(--color-gray-500,#808080)]"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          size={16}
          className={`transition-transform duration-200 shrink-0 ${
            disabled
              ? "text-[color:var(--color-gray-400,#999999)]"
              : "text-[color:var(--color-gray-500,#808080)]"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full min-w-[160px] rounded-lg border border-[color:var(--color-gray-200,#E5E5E5)] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.10)] py-1">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => handleSelect(option)}
                className={[
                  "w-full flex items-center gap-2 px-3 h-9 text-[14px] text-left transition-colors",
                  option.disabled
                    ? "text-[color:var(--color-gray-400,#999999)] cursor-not-allowed"
                    : isSelected
                      ? "bg-[#E0EDFB] text-[color:var(--color-primary-700,#1A5FBE)]"
                      : "text-[color:var(--color-gray-900,#1A1A1A)] hover:bg-[#F2F2F2]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="flex-1">{option.label}</span>
                {isSelected && (
                  <CheckIcon
                    size={16}
                    className="text-[color:var(--color-primary-700,#1A5FBE)] shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
