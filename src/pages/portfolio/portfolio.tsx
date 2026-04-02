import { useState } from "react";

import { SearchIcon, EyeIcon } from "@/shared/ui/icons";

// ─── Mock Data ────────────────────────────────────────────────
interface PortfolioPost {
  id: string;
  thumbnail?: string;
  tags: string[];
  title: string;
  description: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  views: number;
}

const MOCK_POSTS: PortfolioPost[] = [
  {
    id: "1",
    tags: ["#React", "#Frontend"],
    title: "Text Title\n두줄 까지 허용",
    description: "Description 3줄까지 허용. Description 3줄까지 허용.\nDescription 3줄까지 허용.",
    author: "김재준",
    date: "2025.11.03.",
    likes: 12,
    comments: 5,
    views: 234,
  },
  {
    id: "2",
    tags: ["#React", "#Frontend"],
    title: "첫줄만 허용 가능",
    description: "Description 3줄까지 허용.",
    author: "김재준",
    date: "2025.11.03.",
    likes: 12,
    comments: 5,
    views: 234,
  },
  {
    id: "3",
    tags: ["#React", "#Frontend"],
    title: "포트폴리오 제목 예시",
    description: "프로젝트 설명이 여기에 들어갑니다.",
    author: "이영희",
    date: "2025.10.15.",
    likes: 8,
    comments: 3,
    views: 120,
  },
  {
    id: "4",
    tags: ["#Figma", "#UX"],
    title: "UI/UX 디자인 프로젝트",
    description: "디자인 프로젝트에 대한 설명이 들어갑니다.",
    author: "박민수",
    date: "2025.09.20.",
    likes: 20,
    comments: 7,
    views: 310,
  },
];

type SortType = "latest" | "popular" | "views";

// ─── Sub-components ───────────────────────────────────────────

const HeartIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M13.9999 5.33317C13.9999 3.86042 12.8059 2.6665 11.3332 2.6665C10.2392 2.6665 9.29859 3.29984 8.86659 4.22317C8.6999 3.78317 8.42657 3.39184 8.06657 3.08384C7.59191 2.67717 6.9919 2.44984 6.36524 2.44984C4.89257 2.44984 3.69857 3.6439 3.69857 5.1165C3.69857 5.62317 3.85591 6.11317 4.15191 6.52584L7.77458 11.6625C7.89391 11.8318 8.10657 11.9225 8.32524 11.8992C8.47657 11.9118 8.62124 11.8625 8.73257 11.7625L12.7999 7.6332C13.5712 6.9465 13.9999 6.14317 13.9999 5.33317Z"
      fill="currentColor"
    />
  </svg>
);

const CommentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M14 1.3335H2C1.26667 1.3335 0.666672 1.9335 0.666672 2.66683V11.3335C0.666672 12.0668 1.26667 12.6668 2 12.6668H12L15.3333 16.0002V2.66683C15.3333 1.9335 14.7333 1.3335 14 1.3335Z"
      fill="currentColor"
    />
  </svg>
);

interface PostCardProps {
  post: PortfolioPost;
}

const PostCard = ({ post }: PostCardProps) => (
  <div className="flex flex-col items-start min-w-70 w-full cursor-pointer">
    {/* Thumbnail */}
    <div className="aspect-[360/203] border-(--color-gray-200,#E5E5E5) border-l border-r border-t rounded-tl-xl rounded-tr-xl w-full overflow-hidden bg-(--color-gray-100,#F2F2F2)">
      {post.thumbnail ? (
        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-(--color-gray-100,#F2F2F2)" />
      )}
    </div>

    {/* Card body */}
    <div className="bg-white border border-(--color-gray-200,#E5E5E5) flex flex-col gap-4 items-start w-full overflow-clip p-6 rounded-bl-xl rounded-br-xl">
      {/* Tags */}
      <div className="flex gap-2 items-start flex-wrap">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="border border-(--color-primary-900,#003876) flex gap-1 items-center justify-center px-3 py-1 rounded-xl font-medium text-(--color-primary-900,#003876) text-xs tracking-[-0.3px] whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <p className="font-semibold leading-[1.4] text-(--color-gray-800,#333333) text-xl tracking-[-0.5px] line-clamp-2 w-full">
        {post.title}
      </p>

      {/* Description */}
      <p className="font-normal leading-[1.43] text-(--color-gray-600,#666666) text-sm tracking-[-0.35px] line-clamp-3 w-full">
        {post.description}
      </p>

      {/* Author & Date */}
      <div className="flex gap-1 items-center">
        <span className="font-normal text-(--color-gray-500,#808080) text-xs tracking-[-0.3px]">
          {post.author}
        </span>
        <span className="w-0.5 h-0.5 rounded-full bg-(--color-gray-400,#999999)" />
        <span className="font-normal text-(--color-gray-500,#808080) text-xs tracking-[-0.3px]">
          {post.date}
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-1 items-center text-(--color-gray-500,#808080)">
          <HeartIcon />
          <span className="font-medium text-xs tracking-[-0.3px]">{post.likes}</span>
        </div>
        <div className="flex gap-1 items-center text-(--color-gray-500,#808080)">
          <CommentIcon />
          <span className="font-medium text-xs tracking-[-0.3px]">{post.comments}</span>
        </div>
        <div className="flex gap-1 items-center text-(--color-gray-500,#808080)">
          <EyeIcon size={16} />
          <span className="font-medium text-xs tracking-[-0.3px]">{post.views}</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── Navbar ───────────────────────────────────────────────────

const Navbar = () => (
  <header className="sticky top-0 z-50 w-full h-20 backdrop-blur-[6px] bg-[rgba(255,255,255,0.95)] border-b border-(--color-gray-200,#E5E5E5)">
    <div className="max-w-360 mx-auto h-full flex items-center justify-between">
      {/* Logo */}
      <div className="flex gap-1.5 items-center shrink-0">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="6" fill="var(--color-primary-800,#004A9C)" />
          <path
            d="M8 22L16 10L24 22"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10.5 18H21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span className="font-semibold text-(--color-gray-900,#1A1A1A) text-2xl tracking-[-0.6px] whitespace-nowrap leading-[1.33]">
          AIM AJOU
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex gap-12 items-center shrink-0">
        <div className="border-(--color-primary-700,#0056B3) border-b-2 flex items-center justify-center py-2.5">
          <span className="font-normal text-(--color-gray-900,#1A1A1A) text-base tracking-[-0.4px] whitespace-nowrap leading-normal">
            포트폴리오
          </span>
        </div>
        <div className="flex items-center justify-center py-2.5 rounded-md">
          <span className="font-normal text-(--color-gray-900,#1A1A1A) text-base tracking-[-0.4px] whitespace-nowrap leading-normal cursor-pointer hover:text-(--color-primary-700,#0056B3) transition-colors">
            소개
          </span>
        </div>
        <div className="flex items-center justify-center py-2.5 rounded-md">
          <span className="font-normal text-(--color-gray-900,#1A1A1A) text-base tracking-[-0.4px] whitespace-nowrap leading-normal cursor-pointer hover:text-(--color-primary-700,#0056B3) transition-colors">
            공지사항
          </span>
        </div>
      </nav>

      {/* Auth buttons */}
      <div className="flex gap-2 items-center shrink-0">
        <button
          type="button"
          className="bg-(--color-primary-800,#004A9C) flex h-10 items-center justify-center px-6 py-2.5 rounded-lg font-medium text-sm text-white tracking-[-0.35px] whitespace-nowrap hover:bg-(--color-primary-900,#003876) transition-colors"
        >
          회원가입
        </button>
        <button
          type="button"
          className="border border-(--color-primary-800,#004A9C) flex h-10 items-center justify-center px-6 py-2.5 rounded-lg font-medium text-(--color-primary-800,#004A9C) text-sm tracking-[-0.35px] whitespace-nowrap hover:bg-(--color-primary-100,#E0EDFB) transition-colors"
        >
          로그인
        </button>
      </div>
    </div>
  </header>
);

// ─── Footer ───────────────────────────────────────────────────

const Footer = () => (
  <footer className="w-full bg-(--color-gray-50,#F9F9F9) h-50 flex items-center">
    <div className="max-w-360 mx-auto w-full flex items-end justify-between">
      <div className="flex gap-10 items-center">
        <div className="h-15 w-58 flex items-center">
          <span className="font-bold text-(--color-gray-900,#1A1A1A) text-xl">AJOU UNIVERSITY</span>
        </div>
        <div className="flex flex-col gap-5 font-normal text-(--color-gray-500,#808080) text-base tracking-[-0.4px]">
          <div className="flex gap-4 items-center">
            <span className="underline cursor-pointer hover:text-(--color-gray-900,#1A1A1A) transition-colors">
              이용약관
            </span>
            <span className="underline cursor-pointer hover:text-(--color-gray-900,#1A1A1A) transition-colors">
              개인정보처리방침
            </span>
            <span className="underline cursor-pointer hover:text-(--color-gray-900,#1A1A1A) transition-colors">
              사이트맵
            </span>
          </div>
          <p className="leading-normal">
            16499 경기도 수원시 영통구 월드컵로 206 아주대학교
            <br />
            T. 031-219-2114
            <br />
            Copyright © 2024 Ajou University. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Social icons */}
      <div className="flex gap-3 items-center">
        <button
          type="button"
          aria-label="Instagram"
          className="size-6 flex items-center justify-center text-(--color-gray-500,#808080) hover:text-(--color-gray-900,#1A1A1A) transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Facebook"
          className="size-6 flex items-center justify-center text-(--color-gray-500,#808080) hover:text-(--color-gray-900,#1A1A1A) transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="YouTube"
          className="size-6 flex items-center justify-center text-(--color-gray-500,#808080) hover:text-(--color-gray-900,#1A1A1A) transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16135 5.19941C1.82072 5.55057 1.57879 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 1 11.75C0.988787 13.537 1.14277 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0112 9.96295 22.8573 8.1787 22.54 6.42Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.75 15.02L15.5 11.75L9.75 8.48V15.02Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </footer>
);

// ─── Main Page ────────────────────────────────────────────────

export const PortfolioPage = () => {
  const [sort, setSort] = useState<SortType>("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const sortLabels: { key: SortType; label: string }[] = [
    { key: "latest", label: "최신순" },
    { key: "popular", label: "인기순" },
    { key: "views", label: "조회순" },
  ];

  const filteredPosts = MOCK_POSTS.filter(
    (post) =>
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-360 mx-auto pt-15 pb-20 flex flex-col gap-8">
        {/* Search */}
        <div className="bg-(--color-primary-700,#0056B3) flex gap-2 h-12.5 items-center overflow-clip px-4 py-2.5 rounded-full w-full">
          <SearchIcon size={20} className="text-white shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="포트폴리오를 검색해보세요"
            className="flex-1 bg-transparent font-medium text-sm text-(--color-gray-50,#F9F9F9) tracking-[-0.35px] placeholder:text-(--color-gray-50,#F9F9F9) placeholder:opacity-80 outline-none"
          />
        </div>

        {/* Section */}
        <div className="flex flex-col gap-6 w-full">
          {/* Title + count */}
          <div className="flex items-start justify-between w-full">
            <p className="font-bold text-(--color-gray-900,#1A1A1A) text-[40px] tracking-[-1px] leading-[1.3]">
              포트폴리오 탐색
            </p>
            <p className="font-normal text-(--color-gray-500,#808080) text-lg tracking-[-0.45px] leading-[1.56]">
              총{" "}
              <span className="font-semibold text-(--color-primary-800,#004A9C) leading-[1.44]">
                {filteredPosts.length}
              </span>
              개
            </p>
          </div>

          {/* Sort + Grid */}
          <div className="flex flex-col gap-8 w-full">
            {/* Sort buttons */}
            <div className="flex gap-4 items-center">
              {sortLabels.map(({ key, label }) =>
                sort === key ? (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSort(key)}
                    className="bg-(--color-primary-800,#004A9C) flex h-10 items-center justify-center px-6 py-2.5 rounded-full font-medium text-sm text-white tracking-[-0.35px] whitespace-nowrap transition-colors"
                  >
                    {label}
                  </button>
                ) : (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSort(key)}
                    className="border border-(--color-primary-800,#004A9C) flex h-10 items-center justify-center px-6 py-2.5 rounded-full font-medium text-(--color-primary-800,#004A9C) text-sm tracking-[-0.35px] whitespace-nowrap hover:bg-(--color-primary-100,#E0EDFB) transition-colors"
                  >
                    {label}
                  </button>
                ),
              )}
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-4 gap-2.5 w-full">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
