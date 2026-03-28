import React from "react";
// 1. 공통 아이콘 Import 추가
import { FileTextIcon, SearchIcon, BellIcon, AlertCircleIcon, LockIcon, ClockIcon } from "../icons";

// ----------------------------------------------------------------------
// 2. 타입 정의 (type 선호 컨벤션)
// ----------------------------------------------------------------------
export type EmptyStateVariant =
  | "no-content"
  | "no-results"
  | "no-notifications"
  | "error"
  | "access-denied"
  | "coming-soon";

export type EmptyStateAction = {
  label: string;
  onClick: () => void;
};

export type EmptyStateProps = {
  variant?: EmptyStateVariant;
  title?: string; // variant 기본값을 덮어쓸 때 사용
  description?: string; // variant 기본값을 덮어쓸 때 사용
  icon?: React.ReactNode; // 커스텀 아이콘을 사용할 때 사용
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  hasBackground?: boolean;
  className?: string;
};

// ----------------------------------------------------------------------
// 3. Variant 매핑 설정 (상수)
// ----------------------------------------------------------------------
type VariantConfig = {
  title: string;
  description?: string;
  icon: React.ReactNode;
  iconColorClass: string;
};

// 변경된 부분: 공통 아이콘 컴포넌트를 사용하고 w-full h-full로 부모 영역에 맞게 스케일링
const VARIANT_MAP: Record<EmptyStateVariant, VariantConfig> = {
  "no-content": {
    title: "아직 게시물이 없습니다",
    icon: <FileTextIcon className="w-full h-full" />,
    iconColorClass: "text-[color:var(--color-primary-200,#B3D1F7)]",
  },
  "no-results": {
    title: "검색 결과가 없습니다",
    description: "다른 키워드로 시도해보세요",
    icon: <SearchIcon className="w-full h-full" />,
    iconColorClass: "text-[color:var(--color-gray-300,#CCCCCC)]",
  },
  "no-notifications": {
    title: "알림이 없습니다",
    description: "새로운 알림이 오면 여기에 표시됩니다",
    icon: <BellIcon className="w-full h-full" />,
    iconColorClass: "text-[color:var(--color-primary-200,#B3D1F7)]",
  },
  error: {
    title: "데이터를 불러올 수 없습니다",
    description: "잠시 후 다시 시도해주세요",
    icon: <AlertCircleIcon className="w-full h-full" />,
    iconColorClass: "text-[color:var(--color-gray-300,#CCCCCC)]",
  },
  "access-denied": {
    title: "접근 권한이 없습니다",
    description: "관리자에게 문의하세요",
    icon: <LockIcon className="w-full h-full" />,
    iconColorClass: "text-[color:var(--color-gray-300,#CCCCCC)]",
  },
  "coming-soon": {
    title: "곧 만나요!",
    description: "이 기능은 준비 중입니다",
    icon: <ClockIcon className="w-full h-full" />,
    iconColorClass: "text-[color:var(--color-primary-200,#B3D1F7)]",
  },
};

// ----------------------------------------------------------------------
// 4. 스타일 토큰 (상수)
// ----------------------------------------------------------------------
const containerBaseClasses =
  "flex flex-col items-center justify-center w-full min-h-[320px] px-[24px] py-[48px] gap-[24px] text-center";
const titleClasses =
  "font-bold text-[24px] leading-[32px] text-[color:var(--color-gray-800,#333333)] max-w-[400px] whitespace-pre-wrap";
const descriptionClasses =
  "font-normal text-[16px] leading-[24px] text-[color:var(--color-gray-600,#666666)] max-w-[480px] whitespace-pre-wrap";

// Button/Primary/Large 스타일 모방 (실제 Button 컴포넌트가 있다면 대체 가능)
const primaryBtnClasses =
  "inline-flex items-center justify-center h-[48px] px-6 rounded-lg bg-[color:var(--color-primary-800,#004A9C)] text-white font-medium text-[16px] transition-colors hover:bg-[color:var(--color-primary-900,#003875)] active:bg-[color:var(--color-primary-950,#002B5E)]";
// Button/Ghost 스타일 모방
const secondaryBtnClasses =
  "inline-flex items-center justify-center h-[48px] px-6 rounded-lg bg-transparent text-[color:var(--color-gray-600,#666666)] font-medium text-[16px] transition-colors hover:bg-[color:var(--color-gray-100,#F2F2F2)] mt-[12px]";

// ----------------------------------------------------------------------
// 5. 컴포넌트 정의
// ----------------------------------------------------------------------
export const EmptyState = ({
  variant = "no-content",
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  hasBackground = false,
  className = "",
}: EmptyStateProps): React.ReactElement => {
  const config = VARIANT_MAP[variant];

  // Props로 전달된 값이 있으면 우선 사용하고, 없으면 Variant 기본값 사용
  const displayTitle = title ?? config.title;
  const displayDescription = description ?? config.description;
  const displayIcon = icon ?? config.icon;
  const iconColorClass = icon
    ? "text-[color:var(--color-gray-400,#999999)]"
    : config.iconColorClass;

  const containerClasses = [
    containerBaseClasses,
    hasBackground ? "bg-[color:var(--color-gray-50,#F9F9F9)] rounded-lg" : "bg-transparent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {/* 1. Illustration */}
      <div className={`w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] ${iconColorClass}`}>
        {displayIcon}
      </div>

      {/* 2. 텍스트 영역 (Title & Description) */}
      <div className="flex flex-col items-center gap-2">
        <h3 className={titleClasses}>{displayTitle}</h3>
        {displayDescription && <p className={descriptionClasses}>{displayDescription}</p>}
      </div>

      {/* 3. Action 버튼 영역 */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col items-center mt-2 w-full max-w-[320px]">
          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className={`${primaryBtnClasses} w-full sm:w-auto min-w-[120px]`}
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className={`${secondaryBtnClasses} w-full sm:w-auto min-w-[120px]`}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
