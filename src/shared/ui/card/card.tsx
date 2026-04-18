import React from "react";
import Link from "next/link";
import { Button } from "../button";

export type CardVariant = "post" | "profile" | "simple" | "featured";
export type SimpleCardVariant = "default" | "bordered" | "elevated";

// 공통 타입 정의
interface BaseCardProps {
  className?: string;
  onClick?: () => void;
}

interface Author {
  name: string;
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
  href?: string;
  thumbnail?: string;
  tags?: string[];
  title: string;
  description: string;
  author: Author;
  date: string;
  stats: PostStats;
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
  ctaLabel?: string;
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
      href,
      thumbnail,
      tags,
      title,
      description,
      author,
      date,
      stats,
      className = "",
      onClick,
    } = props;

    const wrapperClasses = `flex flex-col group ${onClick ? "cursor-pointer" : ""} ${className}`;

    const content = (
      <>
        {thumbnail && (
          <div className="relative aspect-[360/203] w-full border border-[color:var(--color-gray-200,#e5e5e5)] border-b-0 rounded-t-xl overflow-hidden">
            <img
              src={typeof thumbnail === "string" ? thumbnail : (thumbnail as { src: string }).src}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="bg-white border border-[color:var(--color-gray-200,#e5e5e5)] flex flex-col gap-4 p-6 rounded-b-xl">
          {tags && tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="border border-[color:var(--color-primary-800,#003876)] text-[color:var(--color-primary-800,#003876)] text-[12px] font-medium leading-[1.33] tracking-[-0.3px] px-3 py-1 rounded-xl"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-[color:var(--color-gray-800,#333)] text-[20px] font-semibold leading-[1.4] tracking-[-0.5px] line-clamp-1">
            {title}
          </h3>

          <p className="text-[color:var(--color-gray-600,#666)] text-[14px] leading-[1.43] tracking-[-0.35px] line-clamp-1">
            {description}
          </p>

          <div className="flex items-center gap-1">
            <span className="text-[color:var(--color-gray-500,#808080)] text-[12px] leading-[1.33] tracking-[-0.3px]">
              {author.name}
            </span>
            <div className="w-[2px] h-[2px] bg-[color:var(--color-gray-500,#808080)] rounded-full" />
            <span className="text-[color:var(--color-gray-500,#808080)] text-[12px] leading-[1.33] tracking-[-0.3px]">
              {date}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <StatItem icon="heart" count={stats.likes} />
            <StatItem icon="comment" count={stats.comments} />
            <StatItem icon="view" count={stats.views} />
          </div>
        </div>
      </>
    );

    if (href) {
      return (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={wrapperClasses}>
          {content}
        </Link>
      );
    }

    return (
      <div
        ref={ref}
        className={wrapperClasses}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {content}
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

  const cursorClass = onClick ? "cursor-pointer" : "";

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${cursorClass} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
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
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Button variant="primary" size="medium" fullWidth onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variantClasses[simpleVariant]} ${cursorClass} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
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
    "w-full min-w-0 md:min-w-[400px] p-8 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] rounded-2xl shadow-[0_8px_24px_rgba(0,74,156,0.08)] transition-all duration-200 ease-out";

  const hoverClasses = onClick
    ? "cursor-pointer hover:shadow-[0_12px_32px_rgba(0,74,156,0.12)] hover:-translate-y-1"
    : "";

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
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
          {onCtaClick && ctaLabel && (
            <div
              className="mt-auto"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Button variant="primary" size="large" onClick={onCtaClick}>
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
    comment: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    view: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  };

  return (
    <div className="flex items-center gap-1">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[color:var(--color-gray-500,#808080)]"
      >
        {icons[icon]}
      </svg>
      <span className="text-[12px] font-medium leading-[1.33] tracking-[-0.3px] text-[color:var(--color-gray-500,#808080)]">
        {count}
      </span>
    </div>
  );
};

const StatColumn: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-xl font-bold text-[var(--color-primary-800)]">{value}</span>
    <span className="text-xs text-[var(--color-gray-500)]">{label}</span>
  </div>
);
