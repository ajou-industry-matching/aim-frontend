import React, { useState } from "react";
import { EyeIcon, EyeOffIcon, SearchIcon, XCircleIcon, ChevronDownIcon } from "@/shared/ui/icons";

export type InputSize = "medium" | "large";

interface BaseInputProps {
  hasError?: boolean;
  isFullWidth?: boolean;
}

// 모든 입력 컴포넌트(Input, Textarea, Select) 공통 스타일
const commonStyles = {
  base: "outline-none transition-all duration-200 border placeholder:text-[color:var(--color-gray-500,#808080)] text-[color:var(--color-gray-900,#1A1A1A)]",
  disabled:
    "disabled:bg-[color:var(--color-gray-100,#F2F2F2)] disabled:text-[color:var(--color-gray-400,#999999)] disabled:border-[color:var(--color-gray-200,#E5E5E5)] disabled:cursor-not-allowed",
  focus:
    "focus:border-[color:var(--color-primary-500,#3385DB)] focus:shadow-[0_0_0_3px_var(--color-primary-100,#E0EDFB)]",
  error:
    "!border-[color:var(--color-error-500,#EF4444)] focus:!shadow-[0_0_0_3px_var(--color-error-100,#FEE2E2)]",
  defaultBorder: "border-[color:var(--color-gray-300,#CCCCCC)]",
};

// Input 전용 사이즈 스타일
const sizeStyles: Record<InputSize, string> = {
  medium: "h-10 text-[14px] leading-[20px]",
  large: "h-12 text-[16px] leading-[24px]",
};

// Input 형태 (기본, 검색창)
const shapeStyles = {
  default: `rounded-lg bg-white px-4 ${commonStyles.focus}`,
  search: `rounded-[20px] bg-[color:var(--color-gray-50,#F9F9F9)] pl-10 pr-10 ${commonStyles.focus}`,
};

const getInputClasses = (
  size: InputSize,
  isSearch: boolean,
  hasError: boolean,
  isFullWidth: boolean,
  hasLeftContent: boolean,
  hasRightContent: boolean,
  className?: string,
): string => {
  const shapeClass = isSearch ? shapeStyles.search : shapeStyles.default;
  const stateClass = hasError ? commonStyles.error : commonStyles.defaultBorder;

  // 아이콘 유무에 따른 패딩 계산 (검색 형태는 shapeStyles.search에 고정 패딩 포함)
  const paddingLeftClass = !isSearch && hasLeftContent ? (size === "large" ? "pl-10" : "pl-9") : "";

  const paddingRightClass =
    !isSearch && hasRightContent ? (size === "large" ? "pr-10" : "pr-9") : "";

  // 전체 너비 여부
  const widthClass = isFullWidth ? "w-full" : "w-auto";

  return [
    commonStyles.base,
    commonStyles.disabled,
    sizeStyles[size],
    shapeClass,
    stateClass,
    widthClass,
    paddingLeftClass,
    paddingRightClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");
};

const getTextareaClasses = (
  hasError: boolean,
  isFullWidth: boolean,
  className?: string,
): string => {
  const stateClass = hasError ? commonStyles.error : commonStyles.defaultBorder;
  const widthClass = isFullWidth ? "w-full" : "w-auto";

  return [
    commonStyles.base,
    "min-h-[120px] p-3 text-[16px] leading-[24px] rounded-lg bg-white resize-y",
    commonStyles.focus,
    stateClass,
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");
};

const getSelectClasses = (hasError: boolean, isFullWidth: boolean, className?: string): string => {
  const stateClass = hasError ? commonStyles.error : commonStyles.defaultBorder;
  const widthClass = isFullWidth ? "w-full" : "w-auto";

  return [
    commonStyles.base,
    commonStyles.disabled,
    "h-[48px] px-4 pr-10 appearance-none rounded-lg bg-white text-[16px]",
    commonStyles.focus,
    stateClass,
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");
};

// --- Input 컴포넌트 ---
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, BaseInputProps {
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  passwordStrength?: 0 | 1 | 2 | 3;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      size = "large",
      hasError = false,
      disabled = false,
      isFullWidth = true,
      leftIcon,
      rightIcon,
      className = "",
      passwordStrength,
      onClear,
      ...props
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isSearch = type === "search";
    const currentType = type === "password" && isPasswordVisible ? "text" : type;

    // 아이콘 및 액션 존재 여부
    const hasRightContent = Boolean(
      rightIcon || type === "password" || (isSearch && props.value && onClear),
    );

    const inputClasses = getInputClasses(
      size,
      isSearch,
      hasError,
      isFullWidth,
      Boolean(leftIcon),
      hasRightContent,
      className,
    );

    const containerClasses = `relative inline-flex flex-col transition-all duration-200 ease-out ${
      isFullWidth ? "w-full min-w-[280px]" : "w-auto"
    }`;

    return (
      <div className={containerClasses}>
        <div className="relative w-full">
          {/* 왼쪽 아이콘 */}
          {(leftIcon || isSearch) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-gray-600,#666666)] pointer-events-none">
              {isSearch ? <SearchIcon width={20} /> : leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={currentType}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />

          {/* 오른쪽 아이콘 및 액션 */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {type === "password" && !disabled && (
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="text-[color:var(--color-gray-600,#666666)] hover:text-[color:var(--color-primary-800,#004A9C)] focus:outline-none"
              >
                {isPasswordVisible ? <EyeOffIcon width={20} /> : <EyeIcon width={20} />}
              </button>
            )}

            {isSearch && props.value && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="text-[color:var(--color-gray-600,#666666)] hover:text-[color:var(--color-gray-900,#1A1A1A)] focus:outline-none"
              >
                <XCircleIcon width={16} />
              </button>
            )}

            {!isSearch && type !== "password" && rightIcon && (
              <span className="text-[color:var(--color-gray-600,#666666)] pointer-events-none">
                {rightIcon}
              </span>
            )}
          </div>
        </div>

        {/* 비밀번호 강도 표시 */}
        {type === "password" && passwordStrength !== undefined && (
          <div className="mt-2 w-full h-1 bg-[color:var(--color-gray-100,#F2F2F2)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                passwordStrength === 1
                  ? "w-1/3 bg-[color:var(--color-error-500,#EF4444)]"
                  : passwordStrength === 2
                    ? "w-2/3 bg-[color:var(--color-warning-500,#F59E0B)]"
                    : passwordStrength === 3
                      ? "w-full bg-[color:var(--color-success-500,#10A259)]"
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

// --- Textarea 컴포넌트 ---
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ maxLength, hasError, isFullWidth = true, className = "", onChange, ...props }, ref) => {
    // 초기값 계산
    const [charCount, setCharCount] = useState(() => {
      const initialValue = props.value ?? props.defaultValue ?? "";
      return String(initialValue).length;
    });

    // value가 외부에서 변경될 때도 글자수 동기화
    React.useEffect(() => {
      if (props.value !== undefined) {
        setCharCount(String(props.value).length);
      }
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const textareaClasses = getTextareaClasses(!!hasError, !!isFullWidth, className);
    const containerClasses = `relative ${isFullWidth ? "w-full" : "w-auto"}`;

    return (
      <div className={containerClasses}>
        <textarea
          ref={ref}
          className={textareaClasses}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {maxLength && (
          <div className="absolute right-3 bottom-3 text-[12px] text-[color:var(--color-gray-500,#808080)]">
            {charCount} / {maxLength}
          </div>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

// --- Select 컴포넌트 ---
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError, isFullWidth = true, options, placeholder, className = "", ...props }, ref) => {
    const selectClasses = getSelectClasses(!!hasError, !!isFullWidth, className);
    const containerClasses = `relative ${isFullWidth ? "w-full" : "w-auto"}`;

    return (
      <div className={containerClasses}>
        <select
          ref={ref}
          className={selectClasses}
          defaultValue={placeholder ? "" : undefined}
          {...props}
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
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[color:var(--color-gray-600,#666666)]">
          <ChevronDownIcon width={20} />
        </div>
      </div>
    );
  },
);
Select.displayName = "Select";
