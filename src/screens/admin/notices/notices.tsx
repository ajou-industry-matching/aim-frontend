"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getPosts } from "@/api/posts";
import type { Post } from "@/api/posts";

const PAGE_SIZE = 10;

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const PlusIcon = () => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const AdminNoticesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [notices, setNotices] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPosts("NOTICE", { page, size: PAGE_SIZE, sort: "LATEST" });
      setNotices(response.content);
      setTotalPages(Math.max(1, response.totalPages));
    } catch (fetchError) {
      console.error("[admin] 공지사항 목록 조회 실패", fetchError);
      setError("공지사항 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void fetchNotices();
  }, [fetchNotices]);

  const visibleNotices = search.trim()
    ? notices.filter((notice) => notice.title.toLowerCase().includes(search.trim().toLowerCase()))
    : notices;

  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#111]">공지사항 관리</h1>
          <p className="mt-1 text-[14px] text-[#444]">공지사항을 작성하고 관리할 수 있습니다.</p>
        </div>
        <Link
          href="/admin/notices/new"
          className="flex h-10 items-center gap-2 rounded-lg bg-[#004a9c] px-6 py-2.5 text-[14px] font-medium leading-[1.43] tracking-[-0.35px] text-white transition-colors hover:bg-[#003d8a]"
        >
          <PlusIcon />
          공지사항 작성
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4 flex h-10 items-center gap-2 rounded-md border border-[#e5e5e5] px-3 max-w-sm">
        <span className="shrink-0 text-[#999]">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="제목 검색..."
          className="flex-1 bg-transparent text-[14px] text-[#333] placeholder-[#999] outline-none"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-lg border border-[#e5e5e5]">
        {/* Header */}
        <div className="flex h-12 items-center border-b-2 border-[#e5e5e5] bg-[#f2f2f2] px-5">
          <span className="w-17.5 shrink-0 text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#333]">
            순번
          </span>
          <span className="flex-1 text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#333]">
            제목
          </span>
          <span className="w-27.5 shrink-0 text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#333]">
            작성자
          </span>
          <span className="w-30 shrink-0 text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#333]">
            등록일
          </span>
          <span className="w-30 shrink-0 text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#333]">
            조회수
          </span>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex min-h-14 items-center justify-center px-5 py-8 text-[14px] text-[#999]">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="flex min-h-14 items-center justify-center px-5 py-8 text-[14px] text-red-500">
            {error}
          </div>
        ) : visibleNotices.length === 0 ? (
          <div className="flex min-h-14 items-center justify-center px-5 py-8 text-[14px] text-[#999]">
            {search.trim() ? "검색 결과가 없습니다." : "등록된 공지사항이 없습니다."}
          </div>
        ) : (
          visibleNotices.map((notice) => (
            <div
              key={notice.postId}
              className="flex min-h-14 items-center border-b border-[#e5e5e5] bg-white px-5 py-4 transition-colors hover:bg-[#f9f9f9]"
            >
              <span className="w-17.5 shrink-0 text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333]">
                {notice.postId}
              </span>
              <Link
                href={`/admin/notices/${notice.postId}`}
                className="flex-1 truncate text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333] hover:text-[#004a9c] hover:underline"
              >
                {notice.title}
              </Link>
              <span className="w-27.5 shrink-0 text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333]">
                {notice.authorName ?? "-"}
              </span>
              <span className="w-30 shrink-0 text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333]">
                {formatDate(notice.createdAt)}
              </span>
              <span className="w-30 shrink-0 text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333]">
                {notice.viewCount}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={[
              "flex h-8 w-8 items-center justify-center rounded-md text-[14px] font-medium transition-colors",
              page === p
                ? "bg-[#004a9c] text-white"
                : "text-[#666] hover:bg-[#004a9c]/5 hover:text-[#004a9c]",
            ].join(" ")}
          >
            {p + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
