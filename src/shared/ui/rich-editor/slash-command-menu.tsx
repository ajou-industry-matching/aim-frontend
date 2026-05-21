import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { SlashCommandItem } from "./slash-command";

export type SlashCommandMenuProps = {
  items: SlashCommandItem[];
  selectedIndex: number;
  onSelect: (item: SlashCommandItem) => void;
  clientRect: (() => DOMRect | null) | null;
};

const menuClasses = [
  "z-50 fixed h-auto max-h-[330px] w-72 overflow-y-auto",
  "rounded-md border border-[var(--border-default,#cccccc)]",
  "bg-white px-1 py-2 shadow-md transition-all",
].join(" ");

const itemBaseClasses = [
  "flex w-full items-center space-x-2 rounded-md px-2 py-1.5",
  "text-left text-sm cursor-pointer",
  "transition-colors",
].join(" ");

const itemActiveClasses = "bg-[var(--color-gray-100,#f2f2f2)]";
const itemDefaultClasses = "hover:bg-[var(--color-gray-50,#f9f9f9)]";

const getItemClasses = (isActive: boolean): string =>
  [itemBaseClasses, isActive ? itemActiveClasses : itemDefaultClasses].join(" ");

const emptyClasses = "px-3 py-1.5 text-sm text-[var(--text-secondary,#666666)]";

const getMenuPosition = (clientRect: (() => DOMRect | null) | null) => {
  const rect = clientRect?.();
  if (!rect) return { top: -9999, left: -9999 };
  return { top: rect.bottom + 8, left: rect.left };
};

export const SlashCommandMenu = ({
  items,
  selectedIndex,
  onSelect,
  clientRect,
}: SlashCommandMenuProps) => {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const target = itemRefs.current[selectedIndex];
    target?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (typeof window === "undefined") return null;

  const positionStyle = getMenuPosition(clientRect);

  return createPortal(
    <div className={menuClasses} style={positionStyle} role="menu">
      {items.length === 0 ? (
        <div className={emptyClasses}>명령어가 없습니다</div>
      ) : (
        items.map((item, index) => (
          <button
            key={item.title}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
            role="menuitem"
            aria-current={index === selectedIndex ? "true" : undefined}
            className={getItemClasses(index === selectedIndex)}
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(item);
            }}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-gray-700,#4d4d4d)]">
              {item.icon}
            </span>
            <span className="flex flex-col">
              <span className="font-medium text-[var(--text-primary,#1a1a1a)]">{item.title}</span>
              <span className="text-xs text-[var(--text-secondary,#666666)]">
                {item.description}
              </span>
            </span>
          </button>
        ))
      )}
    </div>,
    document.body,
  );
};
