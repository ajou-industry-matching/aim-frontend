"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const FileIcon = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

type Props = { id: string };

export const AdminNoticesEditPage = ({ id }: Props) => {
  const router = useRouter();
  const [title, setTitle] = useState(`공지사항 제목 예시 ${id}`);
  const author = "관리자";

  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/notices")}
            className="mb-3 flex items-center gap-1 text-[14px] text-[#666] transition-colors hover:text-[#111]"
          >
            <BackIcon />
            목록으로
          </button>
          <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-1px] text-[#111]">
            공지사항 수정
          </h1>
          <p className="mt-2 text-[16px] leading-[1.5] tracking-[-0.4px] text-[#666]">
            공지사항을 수정하세요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-6 py-2.5 rounded-lg bg-[#004a9c] text-white text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-[#003d8a]">
            수정
          </button>
          <button className="h-10 px-6 py-2.5 border border-red-500 rounded-lg text-red-500 text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-red-50">
            삭제
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <section className="mb-8">
        <h2 className="mb-6 text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
          기본 정보
        </h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
              className="h-10 w-full rounded-sm border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#333] placeholder-[#999] outline-none focus:border-[#004a9c]"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">작성자 *</label>
            <input
              type="text"
              value={author}
              disabled
              className="h-10 w-full rounded-sm border border-[#e5e5e5] bg-[#f5f5f5] px-4 text-[14px] text-[#999] outline-none"
            />
          </div>
        </div>
      </section>

      {/* 공지 내용 */}
      <section className="mb-8">
        <h2 className="mb-6 text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
          공지 내용
        </h2>
        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#333]">내용 *</label>
          <div className="min-h-[300px] rounded-sm border border-[#e5e5e5] bg-white p-4">
            <p className="text-[14px] text-[#999]">Editor Component Placeholder</p>
          </div>
        </div>
      </section>

      {/* 파일 첨부 */}
      <section>
        <h2 className="mb-6 text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[#1a1a1a]">
          파일 첨부
        </h2>
        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#333]">첨부파일</label>
          <div className="flex w-full items-center gap-3 rounded-lg border border-[#e5e5e5] bg-white p-3">
            <span className="text-[#666]">
              <FileIcon />
            </span>
            <div>
              <p className="text-[14px] font-medium text-[#333]">sample.pdf</p>
              <p className="text-[12px] text-[#999]">1.1 MB</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
