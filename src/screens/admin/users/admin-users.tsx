"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSelectedAdminUser, useAdminUsers } from "@/lib/admin";
import { Input } from "@/shared/ui";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { SearchIcon } from "@/shared/ui/icons";
import { Table, type TableColumn, type TableRowData } from "@/shared/ui/lists/lists";
import { Loading } from "@/shared/ui/loading";
import { Pagination } from "@/shared/ui/pagination/pagination";
import { formatDate } from "../format-date";
import { AdminFlagBadge, UserRoleBadge, UserStatusBadge } from "../user-badges";

const columns: TableColumn[] = [
  { id: "name", label: "사용자", width: "md", align: "center" },
  { id: "email", label: "이메일", width: "fill", align: "center" },
  { id: "role", label: "권한", width: "md", align: "center" },
  { id: "admin", label: "관리자 여부", width: "md", align: "center" },
  { id: "createdAt", label: "가입일", width: "md", align: "center" },
  { id: "status", label: "상태", width: "md", align: "center" },
];

export const AdminUsersPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useAdminUsers(keyword, page);

  // 입력이 멈추면 검색어를 반영하고 첫 페이지로 되돌린다.
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(search.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const users = data?.content ?? [];
  const rows: TableRowData[] = users.map((user) => ({
    id: String(user.userId),
    name: user.name,
    email: user.email,
    role: <UserRoleBadge user={user} />,
    admin: <AdminFlagBadge adminRole={user.adminRole} isCompact />,
    createdAt: formatDate(user.createdAt),
    status: <UserStatusBadge status={user.status} />,
  }));

  const handleRowClick = (id: string) => {
    const user = users.find((item) => String(item.userId) === id);
    if (!user) return;
    saveSelectedAdminUser(user);
    router.push(`/admin/users/detail?id=${id}`);
  };

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
    return <Table columns={columns} data={rows} onRowClick={handleRowClick} />;
  };

  return (
    <div className="flex-1 space-y-6 bg-white p-8">
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-gray-900,#1a1a1a)]">사용자 관리</h1>
        <p className="text-[14px] text-[var(--color-gray-600,#666666)]">
          플랫폼의 모든 사용자를 관리하세요
        </p>
      </div>

      <div className="max-w-sm">
        <Input
          size="medium"
          isFullWidth
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="이름 또는 이메일 검색..."
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
