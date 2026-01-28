import React, { useState } from "react";
// 실제 프로젝트의 아이콘 경로로 수정해주세요
import { EyeIcon, EyeOffIcon, SearchIcon, XCircleIcon, ChevronDownIcon } from "@/shared/ui/icons";

// ----------------------------------------------------------------------
// 1. Common Types
// ----------------------------------------------------------------------
export type InputSize = "medium" | "large";
type BaseInputProps = {
  error?: boolean;
  fullWidth?: boolean;
};

// ----------------------------------------------------------------------
// 2. Input Component (Text, Password, Search)
// ----------------------------------------------------------------------
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, BaseInputProps {
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  passwordStrength?: 0 | 1 | 2 | 3; // 0:None, 1:Weak, 2:Medium, 3:Strong
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      size = "large",
      error = false,
      disabled = false,
      fullWidth = true,
      leftIcon,
      rightIcon,
      className = "",
      passwordStrength,
      onClear,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isSearch = type === "search";
    const currentType = type === "password" && showPassword ? "text" : type;

    // --- Style Tokens ---
    const baseContainer = `relative inline-flex flex-col transition-all duration-200 ease-out ${
      fullWidth ? "w-full min-w-[280px]" : "w-auto"
    }`;

    const inputBase =
      "w-full outline-none transition-all duration-200 border placeholder:text-[var(--color-gray-500)] text-[var(--color-gray-900)] disabled:bg-[var(--color-gray-100)] disabled:text-[var(--color-gray-400)] disabled:border-[var(--color-gray-200)] disabled:cursor-not-allowed";

    const sizeStyles = {
      medium: "h-10 text-[14px] leading-[20px]",
      large: "h-12 text-[16px] leading-[24px]",
    };

    // Search Type은 Pill Shape(rounded-20px) + Gray Background
    const shapeStyles = isSearch
      ? "rounded-[20px] bg-[var(--color-gray-50)] border-[var(--color-gray-300)] pl-10 pr-10 focus:border-[var(--color-primary-500)] focus:shadow-[0_0_0_3px_var(--color-primary-100)]"
      : "rounded-lg bg-white border-[var(--color-gray-300)] px-4 focus:border-[var(--color-primary-500)] focus:shadow-[0_0_0_3px_var(--color-primary-100)]";

    const errorStyle = error
      ? "!border-[var(--color-error-500)] focus:!shadow-[0_0_0_3px_var(--color-error-100)]"
      : "";

    // Padding Calculation for Icons
    const paddingLeft = leftIcon || isSearch ? (size === "large" ? "pl-10" : "pl-9") : "";
    const paddingRight =
      rightIcon || type === "password" || (isSearch && props.value)
        ? size === "large"
          ? "pr-10"
          : "pr-9"
        : "";

    const combinedClasses = [
      inputBase,
      sizeStyles[size],
      shapeStyles,
      errorStyle,
      paddingLeft,
      paddingRight,
      className,
    ].join(" ");

    return (
      <div className={baseContainer}>
        <div className="relative w-full">
          {/* Left Icon */}
          {(leftIcon || isSearch) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-600)] pointer-events-none">
              {isSearch ? <SearchIcon width={20} /> : leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={currentType}
            disabled={disabled}
            className={combinedClasses}
            {...props}
          />

          {/* Right Icon / Actions */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Password Toggle */}
            {type === "password" && !disabled && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--color-gray-600)] hover:text-[var(--color-primary-800)] focus:outline-none"
              >
                {showPassword ? <EyeOffIcon width={20} /> : <EyeIcon width={20} />}
              </button>
            )}

            {/* Search Clear */}
            {isSearch && props.value && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] focus:outline-none"
              >
                <XCircleIcon width={16} />
              </button>
            )}

            {/* Custom Right Icon */}
            {!isSearch && type !== "password" && rightIcon && (
              <span className="text-[var(--color-gray-600)] pointer-events-none">{rightIcon}</span>
            )}
          </div>
        </div>

        {/* Password Strength Indicator */}
        {type === "password" && passwordStrength !== undefined && (
          <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                passwordStrength === 1
                  ? "w-1/3 bg-[var(--color-error-500)]"
                  : passwordStrength === 2
                    ? "w-2/3 bg-[var(--color-warning-500)]"
                    : passwordStrength === 3
                      ? "w-full bg-[var(--color-success-500)]"
                      : "w-0"
              }`}
            />
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

// ----------------------------------------------------------------------
// 3. Textarea Component
// ----------------------------------------------------------------------
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ maxLength, error, fullWidth = true, className = "", onChange, ...props }, ref) => {
    const [charCount, setCharCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const baseClasses =
      "min-h-[120px] p-3 text-[16px] leading-[24px] rounded-lg border bg-white resize-y outline-none transition-all duration-200 placeholder:text-[var(--color-gray-500)] text-[var(--color-gray-900)] focus:border-[var(--color-primary-500)] focus:shadow-[0_0_0_3px_var(--color-primary-100)]";

    const errorClasses = error
      ? "!border-[var(--color-error-500)] focus:!shadow-[0_0_0_3px_var(--color-error-100)]"
      : "border-[var(--color-gray-300)]";

    const widthClass = fullWidth ? "w-full" : "w-auto";

    return (
      <div className={`relative ${widthClass}`}>
        <textarea
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${widthClass} ${className}`}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {maxLength && (
          <div className="absolute right-3 bottom-3 text-[12px] text-[var(--color-gray-500)]">
            {charCount} / {maxLength}
          </div>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

// ----------------------------------------------------------------------
// 4. Select Component
// ----------------------------------------------------------------------
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, fullWidth = true, options, placeholder, className = "", ...props }, ref) => {
    const baseClasses =
      "h-[48px] px-4 pr-10 appearance-none bg-white border rounded-lg text-[16px] text-[var(--color-gray-900)] outline-none transition-all duration-200 focus:border-[var(--color-primary-500)] focus:shadow-[0_0_0_3px_var(--color-primary-100)] disabled:bg-[var(--color-gray-100)]";

    const errorClasses = error
      ? "!border-[var(--color-error-500)]"
      : "border-[var(--color-gray-300)]";

    const widthClass = fullWidth ? "w-full" : "w-auto";

    return (
      <div className={`relative ${widthClass}`}>
        <select
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${widthClass} ${className}`}
          {...props}
          defaultValue={placeholder ? "" : undefined}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-gray-600)]">
          <ChevronDownIcon width={20} />
        </div>
      </div>
    );
  },
);
Select.displayName = "Select";
