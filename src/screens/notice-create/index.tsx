// src/screens/notice-create/index.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation, type NavItem } from "@/shared/ui/navigation/navigation";
import { Footer } from "@/shared/ui/footer";
import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input/input"; // 공통 Input 컴포넌트 임포트
import { FileTextAltIcon } from "@/shared/ui/icons/index"; // TrashIcon 제외 후 필요한 아이콘만 유지
import { createNotice } from "@/api/notice";

const navItems: NavItem[] = [
  { label: "포트폴리오", href: "/portfolio" },
  { label: "소개", href: "/about" },
  { label: "공지사항", href: "/notice", isActive: true },
];

export function NoticeCreateScreen() {
  const router = useRouter();

  // 입력 필드 상태 관리
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 등록 로직 핸들러
  const handleSubmit = async () => {
    if (!title.trim() || !author.trim() || !description.trim()) {
      alert("제목, 작성자, 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createNotice({
        title,
        description,
        userId: 10, // 임시 고정값 (추후 유저 세션 정보와 연동)
      });

      alert("공지사항이 성공적으로 등록되었습니다.");
      router.push("/notice");
      router.refresh();
    } catch {
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1920px] flex-col bg-white">
      <Navigation
        items={navItems}
        onLogin={() => router.push("/login")}
        onSignup={() => router.push("/signup")}
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pt-[160px] pb-[100px] md:px-12 xl:px-24 2xl:px-0">
        {/* 1. 타이틀 영역 */}
        <div className="mb-12 border-b border-gray-900 pb-6">
          <h1 className="text-[40px] font-bold text-gray-900">공지사항 작성</h1>
          <p className="mt-2 text-[15px] text-gray-500">중요한 공지사항을 작성하고 공유하세요</p>
        </div>

        {/* 2. 기본 정보 섹션 */}
        <section className="mb-12 flex flex-col gap-6">
          <h2 className="text-[20px] font-bold text-gray-900">기본 정보</h2>

          <div className="flex flex-col gap-2">
            <label className="text-[15px] font-medium text-gray-700">제목 *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[15px] font-medium text-gray-700">작성자 *</label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="작성자 이름을 입력하세요"
            />
          </div>
        </section>

        {/* 3. 공지 내용 섹션 */}
        <section className="mb-12 flex flex-col gap-6">
          <h2 className="text-[20px] font-bold text-gray-900">공지 내용</h2>
          <div className="flex flex-col gap-2">
            <label className="text-[15px] font-medium text-gray-700">내용 *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="공지사항 내용을 입력하세요"
              className="min-h-[400px] w-full rounded-md border border-gray-300 p-4 text-[15px] text-gray-800 outline-none focus:border-gray-900"
            />
          </div>
        </section>

        {/* 4. 파일 첨부 섹션 */}
        <section className="mb-12 flex flex-col gap-6">
          <h2 className="text-[20px] font-bold text-gray-900">파일 첨부</h2>
          <div className="flex flex-col gap-4">
            <label className="text-[15px] font-medium text-gray-700">첨부파일</label>

            {/* 드래그 앤 드롭 영역 */}
            <div className="flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100">
              <FileTextAltIcon name="upload" className="mb-2 h-8 w-8 text-gray-400" />
              <span className="font-medium text-gray-700">파일 추가</span>
              <span className="mt-1 text-sm text-gray-500">Max. 50MB, HWP, PDF 등 지원</span>
            </div>

            {/* 첨부된 파일 리스트 예시 */}
            <div className="flex items-center justify-between rounded-md border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <FileTextAltIcon name="file" className="h-6 w-6 text-gray-400" />
                <span className="font-medium text-gray-700">Sample.pdf</span>
                <span className="text-sm text-gray-400">2.5 MB</span>
              </div>
              <button className="px-1 text-lg font-medium text-gray-400 transition-colors hover:text-gray-900">
                ✕
              </button>
            </div>
          </div>
        </section>

        {/* 5. 하단 버튼 영역 */}
        <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-8">
          <Button
            variant="secondary"
            size="large"
            onClick={() => router.back()}
            className="w-[120px]"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            className="w-[120px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
