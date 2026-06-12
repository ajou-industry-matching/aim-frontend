"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPosts } from "@/api/posts";
import type { Post, PostSortType, BoardType } from "@/api/posts";
import { signOut, useAuthUser } from "@/lib/auth";
import { Card } from "@/shared/ui/card";
import { Pagination, Navigation } from "@/shared/ui";
import type { NavItem } from "@/shared/ui";

// --- Constants ---

const navItems: NavItem[] = [
  { label: "포트폴리오", href: "/portfolio", isActive: true },
  { label: "소개", href: "#about" },
  { label: "공지사항", href: "#notice" },
];

type CategoryFilter = "개인" | "기업" | "연구실";

const CATEGORY_FILTERS: CategoryFilter[] = ["개인", "기업", "연구실"];

const CATEGORY_TO_BOARD: Record<CategoryFilter, BoardType> = {
  개인: "PORTFOLIO",
  기업: "COMPANY_PROJECT",
  연구실: "LAB_INTERN",
};

const SORT_OPTIONS: { label: string; value: PostSortType }[] = [
  { label: "최신순", value: "LATEST" },
  { label: "인기순", value: "POPULAR" },
  { label: "조회순", value: "VIEWS" },
];

const PAGE_SIZE = 12;

// --- Mock data ---

const MOCK_POSTS: Post[] = Array.from({ length: 12 }, (_, i) => ({
  postId: i + 1,
  userId: i + 1,
  boardType: "PORTFOLIO",
  title: `포트폴리오 프로젝트 ${i + 1}`,
  description: "Next.js와 TypeScript를 활용한 웹 서비스 개발 프로젝트입니다.",
  visibility: "PUBLIC",
  thumbnailImage: `https://picsum.photos/seed/${i + 1}/360/203`,
  keywords:
    i % 3 === 0 ? ["React", "TypeScript"] : i % 3 === 1 ? ["Next.js", "Tailwind"] : ["Node.js"],
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  likeCount: Math.floor(Math.random() * 50),
  commentCount: Math.floor(Math.random() * 20),
  viewCount: Math.floor(Math.random() * 200),
}));

// --- Helpers ---

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

// --- Component ---

export const PortfolioPage = (): React.ReactElement => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authUser = useAuthUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<PostSortType>("LATEST");
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState(() => searchParams.get("keyword") ?? "");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("개인");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPosts(CATEGORY_TO_BOARD[categoryFilter], {
        page: currentPage - 1,
        size: PAGE_SIZE,
        sort,
        keyword: keyword || undefined,
      });
      setPosts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch {
      setPosts(MOCK_POSTS);
      setTotalPages(3);
      setTotalElements(MOCK_POSTS.length);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sort, keyword, categoryFilter]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setKeyword(searchInput.trim());
  };

  const handleKeywordRemove = () => {
    setKeyword("");
    setSearchInput("");
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: CategoryFilter) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (value: PostSortType) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      {/* 검색 바 */}
      <div className="bg-[#0f2550] px-6 py-5 md:px-16">
        <div className="mx-auto max-w-360">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
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
              type="text"
              placeholder="포트폴리오를 검색해보세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent text-[15px] text-white placeholder-white/50 outline-none"
            />
          </form>
        </div>
      </div>

      <main className="mx-auto w-full max-w-360 px-6 py-8 md:px-16">
        {/* 카테고리 필터 */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={[
                "rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all",
                categoryFilter === cat
                  ? "bg-(--color-primary-800) text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-(--color-primary-800) hover:text-(--color-primary-800)",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 선택된 키워드 칩 */}
        {keyword && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full border border-(--color-primary-800) bg-(--color-primary-50) px-3 py-1 text-[13px] font-medium text-(--color-primary-800)">
              {keyword}
              <button
                onClick={handleKeywordRemove}
                className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-(--color-primary-800) hover:text-white transition-colors"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          </div>
        )}

        {/* 헤더 + 정렬 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-[-0.5px] text-gray-900">
              포트폴리오 탐색
            </h1>
            {!isLoading && (
              <span className="text-[14px] text-gray-500">
                총 {totalElements.toLocaleString()}개
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={[
                  "rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all",
                  sort === opt.value
                    ? "bg-(--color-primary-800) text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-(--color-primary-800) hover:text-(--color-primary-800)",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 포스트 그리드 */}
        {isLoading ? (
          <div className="flex min-h-100 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-(--color-primary-800)" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex min-h-100 flex-col items-center justify-center gap-2 text-gray-500">
            <p className="text-[18px] font-semibold">게시글이 없습니다.</p>
            <p className="text-[14px]">다른 검색어를 시도해보세요.</p>
          </div>
        ) : (
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
        )}

        {/* 페이지네이션 */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-10 md:px-16">
        <div className="mx-auto max-w-360">
          <div className="mb-6 flex justify-center gap-6 text-[13px] text-gray-500">
            <a href="/terms" className="transition-colors hover:text-gray-900">
              이용약관
            </a>
            <a href="/privacy" className="transition-colors hover:text-gray-900">
              개인정보처리방침
            </a>
            <a href="/sitemap" className="transition-colors hover:text-gray-900">
              사이트맵
            </a>
          </div>
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-(--color-primary-800) hover:text-(--color-primary-800)"
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-(--color-primary-800) hover:text-(--color-primary-800)"
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-(--color-primary-800) hover:text-(--color-primary-800)"
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
