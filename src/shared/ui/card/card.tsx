import React from "react";
import { Button } from "../button";

export type CardVariant = "post" | "profile" | "simple" | "featured";
export type SimpleCardVariant = "default" | "bordered" | "elevated";

// 공통 타입 정의
interface BaseCardProps {
  className?: string;
  onClick?: () => void;
}

interface CategoryBadge {
  label: string;
  color?: string;
}

interface Author {
  name: string;
  avatar?: string;
}

interface PostStats {
  likes: number;
  comments: number;
  views: number;
}

interface ProfileStats {
  posts: number;
  likes: number;
  followers: number;
}

// 개별 카드 타입 정의
interface PostCardSpecificProps {
  variant: "post";
  thumbnail?: string;
  category?: CategoryBadge;
  title: string;
  description: string;
  author: Author;
  date: string;
  stats: PostStats;
  isSelected?: boolean;
}

interface ProfileCardSpecificProps {
  variant: "profile";
  avatar: string;
  name: string;
  role: string;
  stats: ProfileStats;
  onAction?: () => void;
  actionLabel?: string;
}

interface SimpleCardSpecificProps {
  variant: "simple";
  children: React.ReactNode;
  simpleVariant?: SimpleCardVariant;
}

interface FeaturedCardSpecificProps {
  variant: "featured";
  image: string;
  badge?: string;
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick?: () => void;
}

export type CardProps = BaseCardProps &
  (
    | PostCardSpecificProps
    | ProfileCardSpecificProps
    | SimpleCardSpecificProps
    | FeaturedCardSpecificProps
  );

export const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { variant } = props;

  switch (variant) {
    case "post":
      return <PostCardContent ref={ref} {...props} />;
    case "profile":
      return <ProfileCardContent ref={ref} {...props} />;
    case "simple":
      return <SimpleCardContent ref={ref} {...props} />;
    case "featured":
      return <FeaturedCardContent ref={ref} {...props} />;
    default:
      return null;
  }
});

Card.displayName = "Card";

// 포스트 카드
const PostCardContent = React.forwardRef<HTMLDivElement, Extract<CardProps, { variant: "post" }>>(
  (props, ref) => {
    const {
      thumbnail,
      category,
      title,
      description,
      author,
      date,
      stats,
      isSelected = false,
      className = "",
      onClick,
    } = props;

    const baseClasses =
      "w-full min-w-[280px] max-w-[360px] p-6 bg-white border rounded-xl transition-all duration-200 ease-out";

    const stateClasses = isSelected
      ? "bg-[var(--color-primary-50)] border-[var(--color-primary-800)] shadow-[0_4px_12px_rgba(0,74,156,0.12)]"
      : "border-[var(--color-gray-200)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[var(--color-primary-200)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5";

    const cursorClass = onClick ? "cursor-pointer" : "";

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${stateClasses} ${cursorClass} ${className}`}
        onClick={onClick}
      >
        {/* 썸네일 */}
        {thumbnail && (
          <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden">
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 카테고리 뱃지 */}
        {category && (
          <div className="mb-4">
            <span
              className="inline-flex items-center h-6 px-3 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: "#FFFFFF",
                color: category.color || "var(--color-primary-800)",
                borderColor: category.color || "var(--color-primary-800)",
              }}
            >
              {category.label}
            </span>
          </div>
        )}

        {/* 제목 */}
        <h3 className="mb-3 text-xl font-semibold leading-7 text-[var(--color-gray-800)] line-clamp-1">
          {title}
        </h3>

        {/* 설명 */}
        <p className="mb-4 text-sm leading-5 text-[var(--color-gray-600)] line-clamp-3">
          {description}
        </p>

        {/* 작성자 정보 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-[var(--color-gray-500)]">{author.name}</span>
          <span className="text-xs text-[var(--color-gray-400)]">·</span>
          <span className="text-xs text-[var(--color-gray-500)]">{date}</span>
        </div>

        {/* 통계 */}
        <div className="flex items-center gap-4">
          <StatItem icon="heart" count={stats.likes} />
          <StatItem icon="comment" count={stats.comments} />
          <StatItem icon="view" count={stats.views} />
        </div>
      </div>
    );
  },
);

PostCardContent.displayName = "PostCardContent";

// 프로필 카드
const ProfileCardContent = React.forwardRef<
  HTMLDivElement,
  Extract<CardProps, { variant: "profile" }>
>((props, ref) => {
  const {
    avatar,
    name,
    role,
    stats,
    onAction,
    actionLabel = "팔로우",
    className = "",
    onClick,
  } = props;

  const baseClasses =
    "w-80 p-8 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] text-center";

  return (
    <div ref={ref} className={`${baseClasses} ${className}`} onClick={onClick}>
      {/* 아바타 */}
      <div className="flex justify-center mb-4">
        <img
          src={avatar}
          alt={name}
          className="w-24 h-24 rounded-full border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
        />
      </div>

      {/* 이름 */}
      <h3 className="text-2xl font-bold leading-8 text-[var(--color-gray-900)] mb-1">{name}</h3>

      {/* 역할 */}
      <p className="text-sm text-[var(--color-gray-600)] mb-6">{role}</p>

      {/* 구분선 */}
      <div className="w-full h-px bg-[var(--color-gray-200)] mb-6" />

      {/* 통계 */}
      <div className="flex justify-around mb-6">
        <StatColumn label="게시물" value={stats.posts} />
        <StatColumn label="좋아요" value={stats.likes} />
        <StatColumn label="팔로워" value={stats.followers} />
      </div>

      {/* 액션 버튼 */}
      {onAction && (
        <Button variant="primary" size="medium" fullWidth onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
});

ProfileCardContent.displayName = "ProfileCardContent";

// 심플 카드
const SimpleCardContent = React.forwardRef<
  HTMLDivElement,
  Extract<CardProps, { variant: "simple" }>
>((props, ref) => {
  const { children, simpleVariant = "default", className = "", onClick } = props;

  const baseClasses = "w-auto p-5 bg-white rounded-lg transition-all duration-200 ease-out";

  const variantClasses: Record<SimpleCardVariant, string> = {
    default: "border border-[var(--color-gray-200)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
    bordered: "border-2 border-[var(--color-gray-300)] hover:border-[var(--color-primary-500)]",
    elevated:
      "border border-[var(--color-gray-200)] shadow-[0_4px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)]",
  };

  const cursorClass = onClick ? "cursor-pointer" : "";

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variantClasses[simpleVariant]} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

SimpleCardContent.displayName = "SimpleCardContent";

// 특집 카드 콘텐츠
const FeaturedCardContent = React.forwardRef<
  HTMLDivElement,
  Extract<CardProps, { variant: "featured" }>
>((props, ref) => {
  const { image, badge, title, description, ctaLabel, onCtaClick, className = "", onClick } = props;

  const baseClasses =
    "w-full min-w-[400px] p-8 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] rounded-2xl shadow-[0_8px_24px_rgba(0,74,156,0.08)] transition-all duration-200 ease-out";

  const hoverClasses = onClick
    ? "cursor-pointer hover:shadow-[0_12px_32px_rgba(0,74,156,0.12)] hover:-translate-y-1"
    : "";

  return (
    <div ref={ref} className={`${baseClasses} ${hoverClasses} ${className}`} onClick={onClick}>
      <div className="flex gap-6">
        {/* 왼쪽 섹션 - 이미지 */}
        <div className="flex-shrink-0">
          <img src={image} alt={title} className="w-[200px] h-[200px] object-cover rounded-xl" />
        </div>

        {/* 오른쪽 섹션 - 콘텐츠 */}
        <div className="flex-1 flex flex-col gap-3">
          {/* 뱃지 */}
          {badge && (
            <div>
              <span className="inline-flex items-center h-6 px-3 bg-[var(--color-primary-800)] text-white text-xs font-medium rounded-full">
                {badge}
              </span>
            </div>
          )}

          {/* 제목 */}
          <h2 className="text-[28px] font-bold leading-9 text-[var(--color-gray-900)]">{title}</h2>

          {/* 설명 */}
          <p className="text-base leading-6 text-[var(--color-gray-700)] flex-1">{description}</p>

          {/* CTA 버튼 */}
          {onCtaClick && (
            <div className="mt-auto">
              <Button
                variant="primary"
                size="large"
                onClick={() => {
                  onCtaClick();
                }}
              >
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

FeaturedCardContent.displayName = "FeaturedCardContent";

// 헬퍼 컴포넌트
const StatItem: React.FC<{ icon: "heart" | "comment" | "view"; count: number }> = ({
  icon,
  count,
}) => {
  const icons = {
    heart: (
      <path d="M8 14L7.05 13.15C3.4 9.86 1 7.69 1 5.05C1 2.88 2.68 1.2 4.85 1.2C6.04 1.2 7.19 1.76 8 2.64C8.81 1.76 9.96 1.2 11.15 1.2C13.32 1.2 15 2.88 15 5.05C15 7.69 12.6 9.86 8.95 13.15L8 14Z" />
    ),
    comment: (
      <path d="M14 2H2C1.45 2 1 2.45 1 3V11C1 11.55 1.45 12 2 12H12L15 15V3C15 2.45 14.55 2 14 2Z" />
    ),
    view: (
      <path d="M8 3C4.5 3 1.73 5.61 1 9C1.73 12.39 4.5 15 8 15C11.5 15 14.27 12.39 15 9C14.27 5.61 11.5 3 8 3ZM8 13C6.34 13 5 11.66 5 10C5 8.34 6.34 7 8 7C9.66 7 11 8.34 11 10C11 11.66 9.66 13 8 13ZM8 8.5C7.17 8.5 6.5 9.17 6.5 10C6.5 10.83 7.17 11.5 8 11.5C8.83 11.5 9.5 10.83 9.5 10C9.5 9.17 8.83 8.5 8 8.5Z" />
    ),
  };

  return (
    <div className="flex items-center gap-1.5">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[var(--color-gray-500)]"
      >
        {icons[icon]}
      </svg>
      <span className="text-xs font-medium text-[var(--color-gray-500)]">{count}</span>
    </div>
  );
};

const StatColumn: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-xl font-bold text-[var(--color-primary-800)]">{value}</span>
    <span className="text-xs text-[var(--color-gray-500)]">{label}</span>
  </div>
);
