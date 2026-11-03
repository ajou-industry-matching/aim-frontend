"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts } from "@/api/posts";
import type { Post } from "@/api/posts";
import { Button, Input } from "@/shared/ui";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { PlusIcon, SearchIcon } from "@/shared/ui/icons";
import { Table, type TableColumn, type TableRowData } from "@/shared/ui/lists/lists";
import { Loading } from "@/shared/ui/loading";
import { Pagination } from "@/shared/ui/pagination/pagination";
import { formatDate } from "../format-date";

const PAGE_SIZE = 10;

const columns: TableColumn[] = [
  { id: "order", label: "순번", width: "sm", align: "center" },
  { id: "title", label: "제목", width: "fill", align: "left", headerAlign: "center" },
  { id: "author", label: "작성자", width: "md", align: "center" },
  { id: "createdAt", label: "등록일", width: "md", align: "center" },
  { id: "viewCount", label: "조회수", width: "md", align: "center" },
];

export const AdminNoticesPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [notices, setNotices] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 입력이 멈추면 검색어를 반영하고 1페이지로 되돌린다(디바운스로 타이핑 중 과도한 요청 방지).
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(search.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPosts("NOTICE", {
        page,
        size: PAGE_SIZE,
        sort: "LATEST",
        keyword: keyword || undefined,
      });
      setNotices(response.content);
      setTotalPages(Math.max(1, response.totalPages));
    } catch (fetchError) {
      console.error("[admin] 공지사항 목록 조회 실패", fetchError);
      setError("공지사항 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    void fetchNotices();
  }, [fetchNotices]);

  const rows: TableRowData[] = notices.map((notice, index) => ({
    id: String(notice.postId),
    order: page * PAGE_SIZE + index + 1,
    title: <div className="truncate">{notice.title}</div>,
    author: notice.authorName,
    createdAt: formatDate(notice.createdAt),
    viewCount: notice.viewCount.toLocaleString(),
  }));

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-16">
          <Loading text="불러오는 중" />
        </div>
      );
    }
    if (error) {
      return <EmptyState variant="error" title="불러오지 못했습니다" description={error} />;
    }
    if (rows.length === 0 && keyword) {
      return <EmptyState variant="no-results" title={`'${keyword}'에 대한 검색 결과가 없습니다`} />;
    }
    return (
      <Table
        columns={columns}
        data={rows}
        onRowClick={(id) => router.push(`/admin/notices/edit?id=${id}`)}
      />
    );
  };

  return (
    <div className="flex-1 space-y-6 bg-white p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[var(--color-gray-900,#1a1a1a)]">
            공지사항 관리
          </h1>
          <p className="text-[14px] text-[var(--color-gray-600,#666666)]">
            공지사항을 작성하고 관리할 수 있습니다.
          </p>
        </div>
        <Button
          size="medium"
          iconPosition="left"
          icon={<PlusIcon size={18} />}
          onClick={() => router.push("/admin/notices/create")}
        >
          공지사항 작성
        </Button>
      </div>

      <div className="max-w-sm">
        <Input
          size="medium"
          isFullWidth
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="제목 검색..."
          leftIcon={<SearchIcon size={16} />}
        />
      </div>

      {renderTable()}

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(nextPage) => setPage(nextPage - 1)}
          />
        </div>
      )}
    </div>
  );
};
