"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useAuthReady, useAuthUser } from "@/lib/auth";
import { Card } from "@/shared/ui/card";
import { storageAsset } from "@/shared/config/storage-asset";
import { Footer, Navigation } from "@/shared/ui";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { SearchIcon } from "@/shared/ui/icons";
import { Spinner } from "@/shared/ui/spinner/spinner";
import type { NavItem } from "@/shared/ui";
import type { BoardType } from "@/api/posts";
import { useHomeStore, type SectionFilter } from "./home-store";

// --- Constants ---

const navItems: NavItem[] = [
  { label: "포트폴리오", href: "/portfolio" },
  { label: "소개", href: "/about" },
  { label: "공지사항", href: "/notice" },
];

const HERO_CARDS = [
  {
    badge: "PORTFOLIO",
    title: "아주인의 성장을 기록하는\n공식 포트폴리오 플랫폼",
    subtitle: "AJOU Portfolio Service",
    description: "수업, 프로젝트, 비교과 활동까지 아주대 학생의 모든 성과를 하나로 관리합니다.",
    bg: "bg-[#1e3a8a]",
    icon: storageAsset("hero-card-2.webp"),
  },
  {
    badge: "FEATURE",
    title: "활동은 자유롭게,\n정리는 체계적으로",
    subtitle: "성과 중심 포트폴리오 관리",
    description: "활동을 입력하면 역할과 기여도가 정리되어 읽기 쉬운 포트폴리오로 구성됩니다.",
    bg: "bg-[#4f46e5]",
    icon: storageAsset("hero-card-1.webp"),
  },
  {
    badge: "FOR ACADEMIC",
    title: "교수에게는 한눈에,\n기업에게는 명확하게",
    subtitle: "제출·검토·공유를 위한 포트폴리오",
    description: "과제 제출, 추천, 채용 활용까지 목적에 맞게 포트폴리오를 공유하세요.",
    bg: "bg-[#334155]",
    icon: storageAsset("hero-card-3.webp"),
  },
  {
    badge: "FOR CAREER",
    title: "나의 성과를\n진로와 연결하세요",
    subtitle: "대외 제출용 포트폴리오",
    description: "인턴십, 공모전, 채용 지원 시 신뢰도 있는 포트폴리오로 활용할 수 있습니다.",
    bg: "bg-[#2563eb]",
    icon: storageAsset("hero-card-4.webp"),
  },
];

const SECTION_FILTERS: SectionFilter[] = ["학생 포트폴리오", "기업 모집공고", "연구실"];
const POST_GRID_CLASSES = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const POST_GRID_STATE_MIN_HEIGHT = "min-h-[420px]";
const HOME_POST_SKELETON_COUNT = 4;

// --- Helpers ---

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

// --- Sub-components ---

const SectionHeader = ({ title, href }: { title: string; href?: string }) => (
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-[24px] font-bold leading-tight tracking-[-0.6px] text-gray-900">{title}</h2>
    {href && (
      <Link
        href={href}
        className="text-[14px] font-medium text-gray-500 hover:text-(--color-primary-800) transition-colors"
      >
        더보기 &gt;
      </Link>
    )}
  </div>
);

const PostCardSkeleton = () => (
  <div
    className="flex w-full min-w-[280px] max-w-[360px] flex-col animate-pulse"
    aria-hidden="true"
  >
    <div className="aspect-[360/203] w-full rounded-t-xl border border-b-0 border-[color:var(--color-gray-200,#e5e5e5)] bg-[var(--color-gray-100,#f5f5f5)]" />
    <div className="flex flex-col gap-4 rounded-b-xl border border-[color:var(--color-gray-200,#e5e5e5)] bg-white p-6">
      <div className="flex gap-2">
        <div className="h-6 w-18 rounded-xl bg-[var(--color-gray-100,#f5f5f5)]" />
        <div className="h-6 w-14 rounded-xl bg-[var(--color-gray-100,#f5f5f5)]" />
      </div>
      <div className="h-7 w-4/5 rounded bg-[var(--color-gray-100,#f5f5f5)]" />
      <div className="h-5 w-full rounded bg-[var(--color-gray-100,#f5f5f5)]" />
      <div className="h-4 w-1/2 rounded bg-[var(--color-gray-100,#f5f5f5)]" />
      <div className="flex gap-4">
        <div className="h-4 w-10 rounded bg-[var(--color-gray-100,#f5f5f5)]" />
        <div className="h-4 w-10 rounded bg-[var(--color-gray-100,#f5f5f5)]" />
        <div className="h-4 w-10 rounded bg-[var(--color-gray-100,#f5f5f5)]" />
      </div>
    </div>
  </div>
);

const PostGridState = ({ children }: { children: React.ReactNode }) => (
  <div className={`flex ${POST_GRID_STATE_MIN_HEIGHT} items-center justify-center`}>{children}</div>
);

const PostGrid = ({
  posts,
  isLoading,
  error,
}: {
  posts: {
    postId: number;
    boardType: BoardType;
    thumbnailImage?: string;
    keywords: string[];
    title: string;
    description: string;
    userId: number;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    viewCount: number;
  }[];
  isLoading: boolean;
  error?: string | null;
}) => {
  if (isLoading) {
    return (
      <div className={POST_GRID_CLASSES} role="status" aria-label="게시글 로딩 중">
        {Array.from({ length: HOME_POST_SKELETON_COUNT }, (_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <PostGridState>
        <EmptyState variant="error" title="게시글을 불러오지 못했습니다" description={error} />
      </PostGridState>
    );
  }

  if (posts.length === 0) {
    return (
      <PostGridState>
        <EmptyState variant="no-content" title="게시글이 없습니다" />
      </PostGridState>
    );
  }

  return (
    <div className={POST_GRID_CLASSES}>
      {posts.map((post) => (
        <Card
          key={post.postId}
          variant="post"
          href={`/portfolio/detail?id=${post.postId}&type=${post.boardType}`}
          thumbnail={post.thumbnailImage}
          tags={post.keywords}
          title={post.title}
          description={post.description}
          author={{ name: `사용자 ${post.userId}` }}
          date={formatDate(post.createdAt)}
          stats={{
            likes: post.likeCount,
            comments: post.commentCount,
            views: post.viewCount,
          }}
        />
      ))}
    </div>
  );
};

// --- Main Component ---

export const HomePage: React.FC = () => {
  const router = useRouter();
  const authUser = useAuthUser();
  const { isReady: isAuthReady } = useAuthReady();
  const searchRef = useRef<HTMLInputElement>(null);
  const newPosts = useHomeStore((state) => state.newPosts);
  const sectionPosts = useHomeStore((state) => state.sectionPosts);
  const noticePosts = useHomeStore((state) => state.noticePosts);
  const sectionFilter = useHomeStore((state) => state.sectionFilter);
  const isLoadingNew = useHomeStore((state) => state.isLoadingNew);
  const isLoadingSection = useHomeStore((state) => state.isLoadingSection);
  const isLoadingNotice = useHomeStore((state) => state.isLoadingNotice);
  const newPostsError = useHomeStore((state) => state.newPostsError);
  const sectionPostsError = useHomeStore((state) => state.sectionPostsError);
  const noticePostsError = useHomeStore((state) => state.noticePostsError);
  const fetchNewPosts = useHomeStore((state) => state.fetchNewPosts);
  const fetchSectionPosts = useHomeStore((state) => state.fetchSectionPosts);
  const fetchNoticePosts = useHomeStore((state) => state.fetchNoticePosts);
  const setSectionFilter = useHomeStore((state) => state.setSectionFilter);

  useEffect(() => {
    void fetchNewPosts();
    void fetchSectionPosts();
    void fetchNoticePosts();
  }, [fetchNewPosts, fetchSectionPosts, fetchNoticePosts]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    if (q) router.push(`/portfolio?keyword=${encodeURIComponent(q)}`);
    else router.push("/portfolio");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <Navigation
        items={navItems}
        user={authUser ?? undefined}
        isAuthLoading={!isAuthReady}
        logoHref="/home"
        onLogin={() => router.push("/login")}
        onSignup={() => router.push("/login")}
        onLogout={() => void handleLogout()}
      />

      {/* Hero Banner */}
      <section className="bg-white px-6 pb-0 pt-10 md:px-16 md:pt-14">
        <div className="mx-auto max-w-360">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {HERO_CARDS.map((card, i) => (
              <div
                key={i}
                className={`relative flex flex-col overflow-hidden rounded-3xl ${card.bg} text-[#f9f9f9]`}
              >
                <div className="flex flex-col gap-2 p-6">
                  <span className="inline-block w-fit rounded-xl border border-[#f9f9f9]/70 px-3 py-1 text-[12px] font-medium tracking-[-0.3px]">
                    {card.badge}
                  </span>
                  <h3 className="whitespace-pre-line text-2xl font-semibold leading-snug tracking-[-0.6px]">
                    {card.title}
                  </h3>
                  <p className="text-lg font-semibold tracking-[-0.45px]">{card.subtitle}</p>
                  <p className="text-base font-normal leading-relaxed tracking-[-0.4px]">
                    {card.description}
                  </p>
                </div>
                <div className="flex flex-1 items-end justify-end px-6 pb-5">
                  <img
                    src={card.icon}
                    alt={`${card.title.replace(/\n/g, " ")} 아이콘`}
                    className="h-35 w-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-4 flex items-center gap-3 rounded-xl bg-[#0056b3] px-5 py-3"
          >
            <SearchIcon size={18} className="shrink-0 text-white/60" />
            <input
              ref={searchRef}
              type="text"
              placeholder="포트폴리오를 검색해보세요"
              className="flex-1 bg-transparent text-[14px] text-white placeholder-white/50 outline-none"
            />
          </form>
        </div>
      </section>

      <main className="mx-auto w-full max-w-360 px-6 py-12 md:px-16 md:py-16">
        {/* 새로 올라온 포트폴리오 */}
        <section className="mb-16">
          <SectionHeader title="새로 올라온 포트폴리오" href="/portfolio" />
          <PostGrid posts={newPosts} isLoading={isLoadingNew} error={newPostsError} />
        </section>

        {/* 아주대학교와 함께하세요 */}
        <section id="about" className="mb-16">
          <h2 className="mb-6 text-center text-[28px] font-bold leading-tight tracking-[-0.7px] text-gray-900">
            아주대학교와 함께하세요.
          </h2>
          <div className="mb-6 flex justify-center gap-2">
            {SECTION_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSectionFilter(filter)}
                className={[
                  "rounded-full px-5 py-2 text-[14px] font-semibold transition-all",
                  sectionFilter === filter
                    ? "bg-(--color-primary-800) text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-(--color-primary-800) hover:text-(--color-primary-800)",
                ].join(" ")}
              >
                {filter}
              </button>
            ))}
          </div>
          <PostGrid posts={sectionPosts} isLoading={isLoadingSection} error={sectionPostsError} />
        </section>

        {/* 공지사항 */}
        <section id="notice">
          <SectionHeader title="공지사항" href="/notice" />
          {isLoadingNotice ? (
            <div className="flex min-h-32 items-center justify-center">
              <Spinner size="large" className="text-(--color-primary-800)" />
            </div>
          ) : noticePostsError ? (
            <EmptyState
              variant="error"
              title="공지사항을 불러오지 못했습니다"
              description={noticePostsError}
            />
          ) : noticePosts.length === 0 ? (
            <EmptyState variant="no-content" title="공지사항이 없습니다." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {noticePosts.map((post) => (
                <Card
                  key={post.postId}
                  variant="post"
                  href={`/notice/${post.postId}`}
                  thumbnail={post.thumbnailImage}
                  tags={post.keywords}
                  title={post.title}
                  description={post.description}
                  author={{ name: `사용자 ${post.userId}` }}
                  date={formatDate(post.createdAt)}
                  stats={{
                    likes: post.likeCount,
                    comments: post.commentCount,
                    views: post.viewCount,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer
        copyright="Copyright © 2026 Ajou University. All Rights Reserved."
        className="mt-auto px-6 md:px-16"
      />
    </div>
  );
};
