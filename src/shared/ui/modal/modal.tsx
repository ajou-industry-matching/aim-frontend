"use client";

import React, { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@/shared/ui/icons";

// --- Global State for Nested Modals ---
let modalOpenCount = 0;
let originalOverflow = "";

// --- Types ---
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  titleId?: string; // 접근성을 위한 ID
};

export type ModalHeaderProps = {
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
  id?: string; // h2에 부여될 ID
};

export type ModalContentProps = {
  children: React.ReactNode;
  className?: string;
};

export type ModalFooterProps = {
  children: React.ReactNode;
  className?: string;
};

// --- Styles ---

const overlayBaseClasses =
  "fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center p-4";

const modalBaseClasses =
  "bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200";

const headerBaseClasses =
  "flex items-center justify-between px-6 py-4 border-b border-[var(--color-gray-100,#f2f2f2)]";
const contentBaseClasses = "flex-1 overflow-y-auto px-6 py-6";
const footerBaseClasses =
  "px-6 py-4 border-t border-[var(--color-gray-100,#f2f2f2)] flex justify-end gap-2";

const getClasses = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" ");

// --- Components ---

export const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  const generatedId = useId();
  const titleId = `modal-title-${generatedId}`;
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;

    // ESC 키 대응
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // 스크롤 잠금 (중첩 모달 대응)
    if (modalOpenCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    modalOpenCount++;

    window.addEventListener("keydown", handleEsc);

    return () => {
      modalOpenCount--;
      if (modalOpenCount === 0) {
        document.body.style.overflow = originalOverflow;
      }
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  // 자식 요소들에 titleId를 주입하기 위해 React.Children.map 사용 (ModalHeader 탐색)
  const childrenWithA11y = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === ModalHeader) {
      return React.cloneElement(child as React.ReactElement<ModalHeaderProps>, { id: titleId });
    }
    return child;
  });

  return createPortal(
    <div className={overlayBaseClasses} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={getClasses(modalBaseClasses, className)}
      >
        {childrenWithA11y}
      </div>
    </div>,
    document.body,
  );
};

export const ModalHeader = ({ title, onClose, children, className, id }: ModalHeaderProps) => (
  <div className={getClasses(headerBaseClasses, className)}>
    {title && (
      <h2 id={id} className="text-[20px] font-bold text-[var(--color-gray-900,#111)]">
        {title}
      </h2>
    )}
    {children}
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-md text-[var(--color-gray-400,#999)] hover:text-[var(--color-gray-600,#666)] hover:bg-[var(--color-gray-100,#f2f2f2)] transition-colors"
        aria-label="Close modal"
      >
        <XIcon size={24} />
      </button>
    )}
  </div>
);

export const ModalContent = ({ children, className }: ModalContentProps) => (
  <div className={getClasses(contentBaseClasses, className)}>{children}</div>
);

export const ModalFooter = ({ children, className }: ModalFooterProps) => (
  <div className={getClasses(footerBaseClasses, className)}>{children}</div>
);
