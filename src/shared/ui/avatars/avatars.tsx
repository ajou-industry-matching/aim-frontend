import React from "react";
// 1. 공통 아이콘 Import 추가
import { UserSolidIcon } from "../icons";

// ----------------------------------------------------------------------
// 타입 정의
// ----------------------------------------------------------------------
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type AvatarStatus = "online" | "away" | "busy" | "offline";

export type AvatarProps = {
  src?: string; // 이미지 URL
  name?: string; // 이름 (이미지 없을 시 이니셜 추출용)
  size?: AvatarSize;
  status?: AvatarStatus;
  badge?: React.ReactNode; // 코너 뱃지 (숫자, 닷 등)
  hasBorder?: boolean; // 하얀색 테두리 여부
  isGrouped?: boolean; // 그룹 내 배치 여부 (테두리 두께 3px 및 z-index 조정을 위함)
  className?: string;
  onClick?: () => void;
};

export type AvatarGroupProps = {
  avatars: AvatarProps[];
  maxVisible?: number; // 최대 표시 개수
  size?: AvatarSize; // 그룹 전체 일괄 사이즈
  className?: string;
};

// ----------------------------------------------------------------------
// 스타일 토큰 (상수)
// ----------------------------------------------------------------------
const avatarBaseClasses =
  "relative inline-flex items-center justify-center rounded-full bg-[color:var(--color-primary-800,#004A9C)] text-white font-bold shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex-shrink-0 select-none";

const avatarSizeClasses: Record<AvatarSize, string> = {
  xs: "w-[24px] h-[24px]",
  sm: "w-[32px] h-[32px]",
  md: "w-[40px] h-[40px]",
  lg: "w-[48px] h-[48px]",
  xl: "w-[64px] h-[64px]",
  "2xl": "w-[96px] h-[96px]",
  "3xl": "w-[128px] h-[128px]",
};

// 비율에 맞춘 텍스트 사이즈
const avatarTextSizeClasses: Record<AvatarSize, string> = {
  xs: "text-[10px]",
  sm: "text-[13px]",
  md: "text-[16px]",
  lg: "text-[19px]",
  xl: "text-[26px]",
  "2xl": "text-[38px]",
  "3xl": "text-[51px]",
};

// 비율에 맞춘 상태 표시기 사이즈
const statusSizeClasses: Record<AvatarSize, string> = {
  xs: "w-[5px] h-[5px] border-[1px]",
  sm: "w-[6px] h-[6px] border-[1.5px]",
  md: "w-[8px] h-[8px] border-[2px]",
  lg: "w-[10px] h-[10px] border-[2px]",
  xl: "w-[13px] h-[13px] border-[2px]",
  "2xl": "w-[19px] h-[19px] border-[3px]",
  "3xl": "w-[26px] h-[26px] border-[4px]",
};

const statusColorClasses: Record<AvatarStatus, string> = {
  online: "bg-[color:var(--color-success-500,#10A259)]",
  away: "bg-[color:var(--color-warning-500,#F59E0B)]",
  busy: "bg-[color:var(--color-error-500,#EF4444)]",
  offline: "bg-[color:var(--color-gray-400,#999999)]",
};

// ----------------------------------------------------------------------
// 헬퍼 함수
// ----------------------------------------------------------------------
const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const getAvatarClasses = (
  size: AvatarSize,
  hasBorder: boolean,
  isGrouped: boolean,
  className: string,
): string => {
  const base = avatarBaseClasses;
  const sizeClass = avatarSizeClasses[size];
  const borderClass = isGrouped
    ? "border-[3px] border-white box-content"
    : hasBorder
      ? "border-[2px] border-white box-content"
      : "";

  return [base, sizeClass, borderClass, className].filter(Boolean).join(" ");
};

// ----------------------------------------------------------------------
// 컴포넌트 정의
// ----------------------------------------------------------------------

// User Avatar Component
export const Avatar = ({
  src,
  name,
  size = "md",
  status,
  badge,
  hasBorder = false,
  isGrouped = false,
  className = "",
  onClick,
}: AvatarProps): React.ReactElement => {
  const isClickable = !!onClick;
  const avatarClasses = getAvatarClasses(
    size,
    hasBorder,
    isGrouped,
    [className, isClickable ? "cursor-pointer" : ""].join(" "),
  );

  return (
    <div className={avatarClasses} onClick={onClick}>
      {/* 1. 이미지 우선 렌더링 */}
      {src ? (
        <img
          src={src}
          alt={name || "User avatar"}
          className="w-full h-full object-cover rounded-full"
        />
      ) : /* 2. 이미지가 없으면 이름 이니셜 */
      name ? (
        <span className={`${avatarTextSizeClasses[size]} tracking-tight`}>{getInitial(name)}</span>
      ) : (
        /* 3. 이름도 없으면 기본 아이콘 */
        <div className="w-full h-full bg-[color:var(--color-gray-200,#E5E5E5)] rounded-full flex items-center justify-center">
          <UserSolidIcon className="w-[60%] h-[60%] text-[color:var(--color-gray-500,#808080)]" />
        </div>
      )}

      {/* 상태 표시기 (우측 하단) */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-white ${statusSizeClasses[size]} ${statusColorClasses[status]} translate-x-[10%] translate-y-[10%]`}
        />
      )}

      {/* 뱃지 (우측 상단 등, badge prop으로 통째로 받음) */}
      {badge && (
        <div className="absolute top-0 right-0 translate-x-[20%] -translate-y-[20%]">{badge}</div>
      )}
    </div>
  );
};

// Avatar Group Component
export const AvatarGroup = ({
  avatars,
  maxVisible = 4,
  size = "md",
  className = "",
}: AvatarGroupProps): React.ReactElement => {
  const safeMaxVisible = Math.max(0, maxVisible);
  const visibleAvatars = avatars.slice(0, safeMaxVisible);
  const hiddenCount = Math.max(0, avatars.length - safeMaxVisible);

  return (
    // Gap: -8px (Tailwind -space-x-2)
    <div className={`flex flex-row items-center -space-x-2 ${className}`}>
      {visibleAvatars.map((avatarProps, index) => (
        <div
          key={index}
          // 왼쪽 아바타가 위로 오도록 z-index 감소 설정
          style={{ zIndex: 100 - index }}
        >
          <Avatar {...avatarProps} size={size} isGrouped />
        </div>
      ))}

      {/* +N 표시기 */}
      {hiddenCount > 0 && (
        <div
          className={`${avatarSizeClasses[size]} relative inline-flex items-center justify-center rounded-full bg-[color:var(--color-gray-200,#E5E5E5)] text-[color:var(--color-gray-600,#666666)] font-bold text-[14px] border-[3px] border-white box-content shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex-shrink-0 z-0`}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  );
};
