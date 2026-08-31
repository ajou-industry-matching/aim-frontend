"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useAuthReady, useAuthUser } from "@/lib/auth";
import { Card } from "@/shared/ui/card";
import { storageAsset } from "@/shared/config/storage-asset";
import { Footer, Navigation } from "@/shared/ui";
import { Loading } from "@/shared/ui/loading";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { SearchIcon } from "@/shared/ui/icons";
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
const POST_GRID_CLASSES =
  "grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const POST_GRID_STATE_MIN_HEIGHT = "min-h-[420px]";

// --- Helpers ---

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

// --- Sub-components ---

const SectionHeader = ({ title, href }: { title: string; href?: string }) => (
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-[40px] font-bold leading-[1.3] tracking-[-1px] text-gray-900">{title}</h2>
    {href && (
      <Link
        href={href}
        className="text-[16px] font-normal text-gray-500 underline hover:text-(--color-primary-800) transition-colors"
      >
        더보기
      </Link>
    )}
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
      <PostGridState>
        <Loading />
      </PostGridState>
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

  // 첫 방문 화면이므로 세 영역이 모두 준비될 때까지 덮개를 유지했다가 완성된 홈을 한 번에 보여준다.
  // 스토어가 라우트 간에 살아있어 재진입 첫 렌더에는 이전 데이터가 남아 있다.
  // 그래서 "로딩이 시작되는 것을 본 뒤 끝났는지"를 기준으로 삼아야 재진입에서도 덮개가 유지된다.
  // (한 번 준비된 뒤 필터를 바꾸는 경우는 해당 영역만 로딩으로 바뀐다.)
  const isAnyLoading = isLoadingNew || isLoadingSection || isLoadingNotice;
  const [hasSeenLoading, setHasSeenLoading] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // 렌더 중 상태 조정(React 권장 패턴). effect에서 setState 하면 한 프레임 늦게 반영된다.
  if (isAnyLoading && !hasSeenLoading) {
    setHasSeenLoading(true);
  }
  if (hasSeenLoading && !isAnyLoading && !hasInitiallyLoaded) {
    setHasInitiallyLoaded(true);
  }

  const isBootstrapping = !hasInitiallyLoaded;

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  // 검색 결과 화면이 덮인 상태로 시작하므로(포트폴리오 목록 참고) 여기서는 바로 이동한다.
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    router.push(q ? `/portfolio?keyword=${encodeURIComponent(q)}` : "/portfolio");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      {/* 첫 방문에는 덮을 이전 화면이 없으므로 아치를 올리지 않고 덮인 상태로 시작한다.
          페이지를 통째로 대체하지 않고 위에 얹는 이유는, 히어로 카피·섹션 제목 같은
          정적 콘텐츠가 프리렌더 HTML에 그대로 남아 검색 노출에 쓰이게 하기 위해서다. */}
      {isBootstrapping && (
        <Loading
          isFullScreen
          hasEnterAnimation={false}
          text="당신의 가능성이 시작되는 곳"
          size="large"
        />
      )}
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
      <section className="bg-white pb-0 pt-[10px]">
        <div className="mx-auto w-full max-w-360 px-6 min-[1440px]:px-0">
          <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
            {HERO_CARDS.map((card, i) => (
              <div
                key={i}
                className={`relative flex flex-col overflow-hidden rounded-3xl ${card.bg} text-[#f9f9f9]`}
              >
                <div className="flex flex-col gap-2 p-6">
                  <span className="inline-block w-fit rounded-xl border border-[#f9f9f9] px-3 py-1 text-[12px] font-medium tracking-[-0.3px]">
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
                    className="size-[200px] object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-[25px] flex items-center gap-2 rounded-[100px] bg-[#0056b3] px-4 py-2.5"
          >
            <SearchIcon size={20} className="shrink-0 text-white/60" />
            <input
              ref={searchRef}
              type="text"
              placeholder="포트폴리오를 검색해보세요"
              className="flex-1 bg-transparent text-[14px] text-white placeholder-white/50 outline-none"
            />
          </form>
        </div>
      </section>

      <main className="mx-auto w-full max-w-360 px-6 py-12 min-[1440px]:px-0 md:py-16">
        {/* 새로 올라온 포트폴리오 */}
        <section className="mb-[60px]">
          <SectionHeader title="새로 올라온 포트폴리오" href="/portfolio" />
          <PostGrid posts={newPosts} isLoading={isLoadingNew} error={newPostsError} />
        </section>

        {/* 아주대학교와 함께하세요 */}
        <section id="about" className="mb-[60px]">
          <h2 className="mb-6 text-center text-[40px] font-bold leading-[1.3] tracking-[-1px] text-gray-900">
            아주대학교와 함께하세요.
          </h2>
          <div className="mb-[40px] flex gap-4">
            {SECTION_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSectionFilter(filter)}
                className={[
                  "rounded-full px-6 py-2.5 text-[14px] font-medium transition-all",
                  sectionFilter === filter
                    ? "bg-(--color-primary-800) text-white"
                    : "border border-(--color-primary-800) bg-white text-(--color-primary-800)",
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
              <Loading />
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
            <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {noticePosts.map((post) => (
                <Card
                  key={post.postId}
                  variant="post"
                  href={`/notice/detail?id=${post.postId}`}
                  hideThumbnail
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
