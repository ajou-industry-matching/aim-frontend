"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useAuthUser } from "@/lib/auth";
import { Card } from "@/shared/ui/card";
import { Navigation } from "@/shared/ui";
import type { NavItem } from "@/shared/ui";
import { useHomeStore, type SectionFilter } from "./home-store";

// --- Constants ---

const navItems: NavItem[] = [
  { label: "포트폴리오", href: "/portfolio" },
  { label: "소개", href: "#about" },
  { label: "공지사항", href: "#notice" },
];

const HERO_CARDS = [
  {
    badge: "PORTFOLIO",
    title: "아주인의 성장을 기록하는\n공식 포트폴리오 플랫폼",
    subtitle: "AJOU Portfolio Service",
    description: "수업, 프로젝트, 비교과 활동까지 아주대 학생의 모든 성과를 하나로 관리합니다.",
    bg: "bg-[#1e3a8a]",
    icon: "/assets/hero-card-2.png",
  },
  {
    badge: "FEATURE",
    title: "활동은 자유롭게,\n정리는 체계적으로",
    subtitle: "성과 중심 포트폴리오 관리",
    description: "활동을 입력하면 역할과 기여도가 정리되어 읽기 쉬운 포트폴리오로 구성됩니다.",
    bg: "bg-[#4f46e5]",
    icon: "/assets/hero-card-1.png",
  },
  {
    badge: "FOR ACADEMIC",
    title: "교수에게는 한눈에,\n기업에게는 명확하게",
    subtitle: "제출·검토·공유를 위한 포트폴리오",
    description: "과제 제출, 추천, 채용 활용까지 목적에 맞게 포트폴리오를 공유하세요.",
    bg: "bg-[#334155]",
    icon: "/assets/hero-card-3.png",
  },
  {
    badge: "FOR CAREER",
    title: "나의 성과를\n진로와 연결하세요",
    subtitle: "대외 제출용 포트폴리오",
    description: "인턴십, 공모전, 채용 지원 시 신뢰도 있는 포트폴리오로 활용할 수 있습니다.",
    bg: "bg-[#2563eb]",
    icon: "/assets/hero-card-4.png",
  },
];

const SECTION_FILTERS: SectionFilter[] = ["학생 포트폴리오", "기업 모집공고", "연구실"];

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

const PostGrid = ({
  posts,
  isLoading,
}: {
  posts: {
    postId: number;
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
}) => {
  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-(--color-primary-800)" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.map((post) => (
        <Card
          key={post.postId}
          variant="post"
          href={`/portfolio/${post.postId}`}
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
  const searchRef = useRef<HTMLInputElement>(null);
  const {
    newPosts,
    sectionPosts,
    noticePosts,
    sectionFilter,
    isLoadingNew,
    isLoadingSection,
    isLoadingNotice,
    fetchNewPosts,
    fetchSectionPosts,
    fetchNoticePosts,
    setSectionFilter,
  } = useHomeStore();

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
                  <img src={card.icon} alt="" className="h-35 w-auto object-contain" />
                </div>
              </div>
            ))}
          </div>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-4 flex items-center gap-3 rounded-xl bg-[#0056b3] px-5 py-3"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-white/60"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
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
          <PostGrid posts={newPosts} isLoading={isLoadingNew} />
        </section>

        {/* 아주대학교와 함께하세요 */}
        <section className="mb-16">
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
          <PostGrid posts={sectionPosts} isLoading={isLoadingSection} />
        </section>

        {/* 공지사항 */}
        <section id="notice">
          <SectionHeader title="공지사항" href="/notice" />
          {isLoadingNotice ? (
            <div className="flex min-h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-(--color-primary-800)" />
            </div>
          ) : noticePosts.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-gray-500">공지사항이 없습니다.</p>
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

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-10 md:px-16">
        <div className="mx-auto max-w-360">
          {/* 상단 링크 */}
          <div className="mb-6 flex justify-center gap-6 text-[13px] text-gray-500">
            <Link href="/terms" className="hover:text-gray-900 transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/sitemap" className="hover:text-gray-900 transition-colors">
              사이트맵
            </Link>
          </div>

          {/* 하단 정보 */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/ajou-logo.svg"
                alt="Ajou University"
                className="h-10 w-10 object-contain"
              />
              <div>
                <p className="text-[14px] font-bold text-gray-900">아주대학교</p>
                <p className="text-[11px] text-gray-400">AJOU University</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-[12px] text-gray-500 md:text-center">
              <p>16499 경기도 수원시 영통구 월드컵로 206 아주대학교</p>
              <p>T. 031-219-2114</p>
              <p>Copyright © 2026 Ajou University. All Rights Reserved.</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-(--color-primary-800) hover:text-(--color-primary-800) transition-colors"
                aria-label="인스타그램"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-(--color-primary-800) hover:text-(--color-primary-800) transition-colors"
                aria-label="페이스북"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-(--color-primary-800) hover:text-(--color-primary-800) transition-colors"
                aria-label="유튜브"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
