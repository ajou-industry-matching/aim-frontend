import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@/shared/ui/icons";

export interface DropdownMenuItem {
  label: string;
  value: string;
  leftIcon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  dividerAfter?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  onSelect?: (item: DropdownMenuItem) => void;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  onSelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    onSelect?.(item);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-[color:var(--color-gray-300,#CCCCCC)] bg-white text-[14px] text-[color:var(--color-gray-900,#1A1A1A)] transition-colors hover:border-[color:var(--color-primary-500,#3385DB)] focus:outline-none focus:shadow-[0_0_0_3px_var(--color-primary-100,#E0EDFB)]"
      >
        {trigger}
        <ChevronDownIcon
          size={16}
          className={`transition-transform duration-200 text-[color:var(--color-gray-500,#808080)] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 min-w-40 rounded-lg border border-[color:var(--color-gray-200,#E5E5E5)] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.10)] py-1">
          {items.map((item) => (
            <React.Fragment key={item.value}>
              <button
                type="button"
                disabled={item.disabled}
                onClick={() => handleSelect(item)}
                className={[
                  "w-full flex items-center gap-2 px-3 h-9 text-[14px] text-left transition-colors",
                  item.disabled
                    ? "text-[color:var(--color-gray-400,#999999)] cursor-not-allowed"
                    : "text-[color:var(--color-gray-900,#1A1A1A)] hover:bg-[#F2F2F2] active:bg-[#E0EDFB]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.leftIcon && (
                  <span className="text-[color:var(--color-gray-500,#808080)] shrink-0">
                    {item.leftIcon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-[12px] text-[color:var(--color-gray-400,#999999)] shrink-0">
                    {item.shortcut}
                  </span>
                )}
              </button>
              {item.dividerAfter && (
                <div className="my-1 border-t border-[color:var(--color-gray-100,#F2F2F2)]" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
