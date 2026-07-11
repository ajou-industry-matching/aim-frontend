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

const XIcon = () => (
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
);

const ImageIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#ccc]"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

type Props = { id: string };

const MOCK_TITLES: Record<string, string> = {
  "1": "인공지능을 이용한 포트폴리오 제작",
  "2": "React와 Spring Boot를 이용한 팀 프로젝트",
  "3": "블록체인 기반 데이터 보안 시스템 설계",
};

export const AdminPortfolioEditPage = ({ id }: Props) => {
  const router = useRouter();
  const [title, setTitle] = useState(MOCK_TITLES[id] ?? `포트폴리오 ${id}`);
  const [description, setDescription] = useState(
    "Next.js와 TypeScript를 활용한 웹 서비스 개발 프로젝트입니다.",
  );
  const [tags, setTags] = useState(["React", "TypeScript", "Python"]);
  const [tagInput, setTagInput] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public">("public");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  return (
    <div className="flex-1 bg-white p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/portfolio")}
            className="mb-3 flex items-center gap-1 text-[14px] text-[#666] transition-colors hover:text-[#111]"
          >
            <BackIcon />
            목록으로
          </button>
          <h1 className="text-[32px] font-bold text-[#111]">포트폴리오 수정</h1>
          <p className="mt-1 text-[14px] text-[#444]">포트폴리오의 기본 정보를 작성하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-6 py-2.5 rounded-lg bg-[#004a9c] text-white text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-[#003d8a]">
            저장
          </button>
          <button className="h-10 px-6 py-2.5 border border-red-500 rounded-lg text-red-500 text-[14px] font-medium leading-[1.43] tracking-[-0.35px] transition-colors hover:bg-red-50">
            삭제
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <section className="mb-8">
        <h2 className="mb-6 text-[20px] font-semibold text-[#111]">기본 정보</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">
              포트폴리오 제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="포트폴리오 제목 입력..."
              className="h-10 w-full rounded-sm border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#333] placeholder-[#999] outline-none focus:border-[#004a9c]"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="포트폴리오 설명을 입력하세요"
              rows={3}
              className="w-full rounded-sm border border-[#e5e5e5] bg-white px-4 py-3 text-[14px] text-[#333] placeholder-[#999] outline-none focus:border-[#004a9c] resize-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">태그</label>
            <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-sm border border-[#e5e5e5] bg-white px-3 py-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[12px] text-[#333]"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-0.5 text-[#999] hover:text-[#333]"
                  >
                    <XIcon />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="태그 입력 후 Enter"
                className="flex-1 min-w-24 bg-transparent text-[14px] text-[#333] placeholder-[#999] outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 상세 내용 */}
      <section className="mb-8">
        <h2 className="mb-6 text-[20px] font-semibold text-[#111]">상세 내용</h2>
        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#333]">
            포트폴리오 내용 작성 *
          </label>
          <div className="min-h-[300px] rounded-sm border border-[#e5e5e5] bg-white p-4">
            <p className="text-[14px] text-[#999]">Editor Component Placeholder</p>
          </div>
        </div>
      </section>

      {/* 미디어 및 링크 */}
      <section className="mb-8">
        <h2 className="mb-6 text-[20px] font-semibold text-[#111]">미디어 및 링크</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">썸네일 이미지</label>
            <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-[#e5e5e5] bg-[#f9f9f9] cursor-pointer hover:bg-[#f2f2f2] transition-colors">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon />
                <p className="text-[13px] text-[#999]">클릭하여 이미지 업로드</p>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">URL 링크</label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-10 w-full rounded-sm border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#333] placeholder-[#999] outline-none focus:border-[#004a9c]"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">GitHub URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="h-10 w-full rounded-sm border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#333] placeholder-[#999] outline-none focus:border-[#004a9c]"
            />
          </div>
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#333]">공개 범위</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="public"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                  className="accent-[#004a9c]"
                />
                <span className="text-[14px] text-[#333]">전체 공개</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="private"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="accent-[#004a9c]"
                />
                <span className="text-[14px] text-[#333]">비공개</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 파일 첨부 */}
      <section>
        <h2 className="mb-6 text-[20px] font-semibold text-[#111]">파일 첨부</h2>
        <button className="flex h-10 items-center gap-2 rounded-lg border border-[#e5e5e5] px-4 text-[14px] font-medium text-[#333] transition-colors hover:bg-[#f9f9f9]">
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
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          파일 업로드
        </button>
      </section>
    </div>
  );
};
