import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@/shared/ui/icons";

// --- Types ---
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export type ModalHeaderProps = {
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
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

// 1. Overlay
const overlayBaseClasses =
  "fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center p-4";

// 2. Modal Container
const modalBaseClasses =
  "bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200";

// 3. Sections
const headerBaseClasses =
  "flex items-center justify-between px-6 py-4 border-b border-[var(--color-gray-100,#f2f2f2)]";
const contentBaseClasses = "flex-1 overflow-y-auto px-6 py-6";
const footerBaseClasses =
  "px-6 py-4 border-t border-[var(--color-gray-100,#f2f2f2)] flex justify-end gap-2";

const getModalClasses = (className?: string) =>
  [modalBaseClasses, className].filter(Boolean).join(" ");

// --- Components ---

export const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  // ESC 키 대응 및 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={overlayBaseClasses} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" className={getModalClasses(className)}>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export const ModalHeader = ({ title, onClose, children, className }: ModalHeaderProps) => (
  <div className={[headerBaseClasses, className].join(" ")}>
    {title && <h2 className="text-[20px] font-bold text-[var(--color-gray-900,#111)]">{title}</h2>}
    {children}
    {onClose && (
      <button
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
  <div className={[contentBaseClasses, className].join(" ")}>{children}</div>
);

export const ModalFooter = ({ children, className }: ModalFooterProps) => (
  <div className={[footerBaseClasses, className].join(" ")}>{children}</div>
);
