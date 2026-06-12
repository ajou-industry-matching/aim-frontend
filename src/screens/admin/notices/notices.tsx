"use client";

import { useState } from "react";

type Notice = {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  views: number;
};

const MOCK_NOTICES: Notice[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: `공지사항 제목 예시 ${i + 1}`,
  author: "관리자",
  createdAt: "2025.01.20",
  views: 123,
}));

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

const TOTAL_PAGES = 3;

export const AdminNoticesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#111]">공지사항 관리</h1>
          <p className="mt-1 text-[16px] text-[#666]">공지사항을 작성하고 관리할 수 있습니다.</p>
        </div>
        <button className="flex h-10 items-center gap-2 rounded-lg bg-[#004a9c] px-4 py-2.5 text-[14px] font-medium leading-[1.43] tracking-[-0.35px] text-white transition-colors hover:bg-[#003d8a]">
          <PlusIcon />
          공지사항 작성
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2 rounded-md border border-[#e5e5e5] px-3 h-10 max-w-sm">
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
          <span className="w-[70px] shrink-0 text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#333]">
            순번
          </span>
          <span className="flex-1 text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#333]">
            제목
          </span>
          <span className="w-[110px] shrink-0 text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#333]">
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
        {MOCK_NOTICES.map((notice) => (
          <div
            key={notice.id}
            className="flex min-h-14 items-center border-b border-[#e5e5e5] bg-white px-5 py-4 transition-colors hover:bg-[#f9f9f9]"
          >
            <span className="w-[70px] shrink-0 text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333]">
              {notice.id}
            </span>
            <span className="flex-1 truncate text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333]">
              {notice.title}
            </span>
            <span className="w-[110px] shrink-0 text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333]">
              {notice.author}
            </span>
            <span className="w-30 shrink-0 text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333]">
              {notice.createdAt}
            </span>
            <span className="w-30 shrink-0 text-[14px] leading-[1.43] tracking-[-0.35px] text-[#333]">
              {notice.views}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-1">
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
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
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};
