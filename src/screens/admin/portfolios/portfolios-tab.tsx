"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_PORTFOLIOS_PAGE_SIZE, useAdminPortfolios } from "@/lib/admin";
import { Input } from "@/shared/ui";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { SearchIcon } from "@/shared/ui/icons";
import { Table, type TableColumn, type TableRowData } from "@/shared/ui/lists/lists";
import { Loading } from "@/shared/ui/loading";
import { Pagination } from "@/shared/ui/pagination/pagination";
import { formatDate } from "../format-date";

const columns: TableColumn[] = [
  { id: "order", label: "순번", width: "sm", align: "center" },
  { id: "title", label: "제목", width: "fill", align: "left", headerAlign: "center" },
  { id: "author", label: "작성자", width: "md", align: "center" },
  { id: "viewCount", label: "조회수", width: "md", align: "center" },
  { id: "createdAt", label: "등록일", width: "md", align: "center" },
];

export const PortfoliosTab = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useAdminPortfolios(keyword, page);

  // 입력이 멈추면 검색어를 반영하고 첫 페이지로 되돌린다.
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(search.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const rows: TableRowData[] = (data?.content ?? []).map((post, index) => ({
    id: String(post.postId),
    order: page * ADMIN_PORTFOLIOS_PAGE_SIZE + index + 1,
    title: <div className="truncate">{post.title}</div>,
    author: post.authorName,
    viewCount: post.viewCount.toLocaleString(),
    createdAt: formatDate(post.createdAt),
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
        onRowClick={(id) => router.push(`/admin/portfolios/edit?id=${id}`)}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Input
          size="medium"
          isFullWidth
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="검색어 입력..."
          leftIcon={<SearchIcon size={16} />}
        />
      </div>

      {renderTable()}

      {data && data.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={page + 1}
            totalPages={data.totalPages}
            onPageChange={(nextPage) => setPage(nextPage - 1)}
          />
        </div>
      )}
    </div>
  );
};
