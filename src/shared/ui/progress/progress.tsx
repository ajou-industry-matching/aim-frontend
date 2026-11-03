import React from "react";

// ==========================================
// Progress Bar
// ==========================================
export interface ProgressBarProps {
  value: number; // 0 ~ 100
  variant?: "primary" | "success" | "warning" | "error";
  size?: "thin" | "medium" | "thick";
  hasStripes?: boolean;
  isAnimated?: boolean;
  labelPosition?: "none" | "top" | "inside";
  className?: string;
}

export const ProgressBar = ({
  value,
  variant = "primary",
  size = "medium",
  hasStripes = false,
  isAnimated = false,
  labelPosition = "none",
  className = "",
}: ProgressBarProps) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variantClasses = {
    primary: "bg-[color:var(--color-primary-800,#004A9C)]",
    success: "bg-[color:var(--color-success-500,#10A259)]",
    warning: "bg-[color:var(--color-warning-500,#F59E0B)]",
    error: "bg-[color:var(--color-error-500,#EF4444)]",
  };

  const sizeClasses = {
    thin: "h-[4px] rounded-[2px]",
    medium: "h-[8px] rounded-[4px]",
    thick: "h-[12px] rounded-[6px]",
  };

  const fillClasses = [
    "h-full rounded-full transition-all duration-300 ease-in-out relative overflow-hidden",
    variantClasses[variant],
    hasStripes ? "bg-stripes bg-[length:1rem_1rem]" : "", // 👈 bg-[length:1rem_1rem] 추가
    isAnimated && hasStripes ? "animate-progress-stripes" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {/* Top Label */}
      {labelPosition === "top" && (
        <div className="flex justify-between items-center text-[12px] font-medium text-[color:var(--color-gray-600,#666666)] mb-1">
          <span>진행률</span>
          <span>{clampedValue}%</span>
        </div>
      )}

      {/* Track */}
      <div
        className={`w-full bg-[color:var(--color-gray-200,#E5E5E5)] overflow-hidden ${sizeClasses[size]}`}
      >
        {/* Fill */}
        <div className={fillClasses} style={{ width: `${clampedValue}%` }}>
          {/* Inside Label */}
          {labelPosition === "inside" && size === "thick" && (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
              {clampedValue}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 14-2. Circular Progress
// ==========================================
export interface CircularProgressProps {
  value: number; // 0 ~ 100
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  className?: string;
}

export const CircularProgress = ({
  value,
  size = "medium",
  showLabel = true,
  className = "",
}: CircularProgressProps) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeConfig = {
    small: { svgSize: 32, strokeWidth: 4, fontSize: "text-[12px]" },
    medium: { svgSize: 64, strokeWidth: 6, fontSize: "text-[16px]" },
    large: { svgSize: 96, strokeWidth: 8, fontSize: "text-[20px]" },
  };

  const { svgSize, strokeWidth, fontSize } = sizeConfig[size];
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        {/* Background Circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="var(--color-gray-200, #E5E5E5)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary-800, #004A9C)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {/* Center Label */}
      {showLabel && (
        <span
          className={`absolute font-bold text-[color:var(--color-gray-900,#1A1A1A)] ${fontSize}`}
        >
          {clampedValue}%
        </span>
      )}
    </div>
  );
};

// ==========================================
// 14-3. Spinner
// ==========================================
export interface SpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export const Spinner = ({ size = "medium", className = "" }: SpinnerProps) => {
  const sizeClasses = {
    small: "w-[16px] h-[16px] border-[2px]",
    medium: "w-[24px] h-[24px] border-[3px]",
    large: "w-[48px] h-[48px] border-[4px]",
  };

  return (
    <div
      className={`rounded-full animate-spin border-[color:var(--color-gray-200,#E5E5E5)] border-t-[color:var(--color-primary-800,#004A9C)] ${sizeClasses[size]} ${className}`}
    />
  );
};

// ==========================================
// 14-4. Skeleton Loader
// ==========================================
export interface SkeletonProps {
  shape?: "text" | "title" | "circle" | "rectangle";
  className?: string;
}

export const Skeleton = ({ shape = "text", className = "" }: SkeletonProps) => {
  const shapeClasses = {
    text: "w-full h-[12px] rounded-[4px]",
    title: "w-[60%] h-[20px] rounded-[6px]",
    circle: "w-[40px] h-[40px] rounded-full flex-shrink-0",
    rectangle: "w-full aspect-video rounded-[8px]",
  };

  return (
    <div
      className={`relative overflow-hidden bg-[color:var(--color-gray-200,#E5E5E5)] ${shapeClasses[shape]} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-[color:var(--color-gray-100,#F2F2F2)] to-transparent" />
    </div>
  );
};
