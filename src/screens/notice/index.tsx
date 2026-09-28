// src/screens/notice/index.tsx
"use client";

import { useRouter } from "next/navigation";
import { Footer } from "@/shared/ui/footer";
import { Table, type TableColumn, type TableRowData } from "@/shared/ui/lists/lists";
import { Pagination } from "@/shared/ui/pagination/pagination";
import type { Notice } from "@/api/notice";

interface NoticeScreenProps {
  notices: Notice[];
  currentPage: number;
  totalPages: number;
}

export function NoticeScreen({ notices, currentPage, totalPages }: NoticeScreenProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}.`;
  };

  const noticeColumns: TableColumn[] = [
    { id: "postId", label: "순번", width: "sm", align: "center" },
    { id: "title", label: "제목", width: "fill", align: "left", headerAlign: "center" },
    { id: "createdAt", label: "등록일", width: "md", align: "center" },
    { id: "viewCount", label: "조회수", width: "md", align: "center" },
  ];

  const tableData: TableRowData[] = notices.map((notice) => ({
    id: notice.postId.toString(),
    postId: notice.postId,
    title: <div className="truncate text-gray-800 hover:underline">{notice.title}</div>,
    createdAt: formatDate(notice.createdAt),
    viewCount: notice.viewCount,
  }));

  const handlePageChange = (page: number) => {
    router.push(`/notice?page=${page}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="mx-auto flex-1 w-full max-w-[1440px] px-4 pt-[160px] pb-[100px]">
        <h1 className="mb-[60px] text-center text-[40px] font-bold leading-[1.3] tracking-[-0.025em] text-gray-900">
          공지사항
        </h1>

        <div className="w-full">
          <Table
            columns={noticeColumns}
            data={tableData}
            isEmpty={notices.length === 0}
            onRowClick={(id) => router.push(`/notice/detail?id=${id}`)}
          />
        </div>

        <div className="mt-[110px] flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
