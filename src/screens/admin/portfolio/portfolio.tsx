"use client";

import { useState } from "react";
import Link from "next/link";

type Portfolio = {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  createdAt: string;
};

const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: 1,
    title: "인공지능을 이용한 포트폴리오 제작",
    author: "홍길동",
    views: 1326,
    likes: 127,
    createdAt: "2025.01.20",
  },
  {
    id: 2,
    title: "React와 Spring Boot를 이용한 팀 프로젝트",
    author: "이지훈",
    views: 523,
    likes: 45,
    createdAt: "2025.01.19",
  },
  {
    id: 3,
    title: "블록체인 기반 데이터 보안 시스템 설계",
    author: "김민수",
    views: 892,
    likes: 78,
    createdAt: "2025.01.18",
  },
  {
    id: 4,
    title: "딥러닝을 활용한 이미지 분류 모델 개발",
    author: "박지영",
    views: 341,
    likes: 29,
    createdAt: "2025.01.17",
  },
  {
    id: 5,
    title: "마이크로서비스 아키텍처 기반 쇼핑몰 구축",
    author: "최현우",
    views: 674,
    likes: 56,
    createdAt: "2025.01.16",
  },
];

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

export const AdminPortfolioPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = MOCK_PORTFOLIOS.filter(
    (p) => p.title.includes(search) || p.author.includes(search),
  );

  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#111]">포트폴리오 관리</h1>
          <p className="mt-1 text-[14px] text-[#444]">플랫폼의 모든 포트폴리오를 관리하세요.</p>
        </div>
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
          placeholder="제목 또는 작성자 검색..."
          className="flex-1 bg-transparent text-[14px] text-[#333] placeholder-[#999] outline-none"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-lg border border-[#e5e5e5]">
        {/* Header */}
        <div className="flex h-12 items-center border-b-2 border-[#e5e5e5] bg-[#f2f2f2] px-5 text-[14px] font-semibold text-[#333]">
          <span className="w-[70px] shrink-0">순번</span>
          <span className="flex-1">제목</span>
          <span className="w-24 shrink-0">작성자</span>
          <span className="w-20 shrink-0">조회수</span>
          <span className="w-20 shrink-0">좋아요</span>
          <span className="w-28 shrink-0">등록일</span>
        </div>

        {/* Rows */}
        {filtered.map((portfolio) => (
          <div
            key={portfolio.id}
            className="flex min-h-14 items-center border-b border-[#e5e5e5] bg-white px-5 py-3 text-[14px] text-[#333] transition-colors hover:bg-[#f9f9f9]"
          >
            <span className="w-[70px] shrink-0">{portfolio.id}</span>
            <Link
              href={`/admin/portfolio/${portfolio.id}`}
              className="flex-1 truncate hover:text-[#004a9c] hover:underline"
            >
              {portfolio.title}
            </Link>
            <span className="w-24 shrink-0 text-[#555]">{portfolio.author}</span>
            <span className="w-20 shrink-0 text-[#555]">{portfolio.views.toLocaleString()}</span>
            <span className="w-20 shrink-0 text-[#555]">{portfolio.likes}</span>
            <span className="w-28 shrink-0 text-[#555]">{portfolio.createdAt}</span>
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
