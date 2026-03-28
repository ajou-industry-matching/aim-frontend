import type { ReactNode } from "react";

// --- Types ---
export type FormFieldProps = {
  children: ReactNode;
  className?: string;
};

export type FormLabelProps = {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
};

export type FormHelperTextProps = {
  children: ReactNode;
  className?: string;
};

export type FormErrorMessageProps = {
  children: ReactNode;
  className?: string;
};

// --- Styles ---

// 1. FormField
const fieldBaseClasses = "flex flex-col gap-2 w-full";
const getFieldClasses = (className?: string) =>
  [fieldBaseClasses, className].filter(Boolean).join(" ");

// 2. FormLabel
const labelBaseClasses =
  "text-[16px] font-medium text-[var(--color-gray-800,#333)] flex items-center gap-1";
const getLabelClasses = (className?: string) =>
  [labelBaseClasses, className].filter(Boolean).join(" ");

// 3. FormHelperText
const helperBaseClasses = "text-[14px] leading-[1.5] text-[var(--color-gray-600,#666)]";
const getHelperClasses = (className?: string) =>
  [helperBaseClasses, className].filter(Boolean).join(" ");

// 4. FormErrorMessage
const errorBaseClasses =
  "text-[14px] leading-[1.5] text-[var(--color-error-500,#EF4444)] font-medium";
const getErrorClasses = (className?: string) =>
  [errorBaseClasses, className].filter(Boolean).join(" ");

// --- Components ---

export const FormField = ({ children, className }: FormFieldProps) => {
  return <div className={getFieldClasses(className)}>{children}</div>;
};

export const FormLabel = ({ children, required, htmlFor, className }: FormLabelProps) => {
  return (
    <label htmlFor={htmlFor} className={getLabelClasses(className)}>
      {children}
      {required && <span className="text-[var(--color-error-500,#EF4444)] ml-0.5">*</span>}
    </label>
  );
};

export const FormHelperText = ({ children, className }: FormHelperTextProps) => {
  return <p className={getHelperClasses(className)}>{children}</p>;
};

export const FormErrorMessage = ({ children, className }: FormErrorMessageProps) => {
  return (
    <p role="alert" className={getErrorClasses(className)}>
      {children}
    </p>
  );
};
