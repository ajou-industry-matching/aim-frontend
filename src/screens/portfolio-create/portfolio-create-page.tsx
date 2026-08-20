"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { PortfolioBoardType } from "@/api/posts";
import { useAuthReady } from "@/lib/auth";
import { useCreatePortfolio } from "@/lib/posts";
import { PortfolioForm, type PortfolioFormSubmitValue } from "@/screens/portfolio-form";
import { Loading } from "@/shared/ui/loading";

// 작성 페이지는 포트폴리오 게시판 전용.
const BOARD_TYPE: PortfolioBoardType = "PORTFOLIO";

export const PortfolioCreatePage = () => {
  const router = useRouter();
  const { isReady: isAuthReady, isAuthenticated } = useAuthReady();
  const { submit, isSubmitting, error: submitError } = useCreatePortfolio();

  // 미인증 사용자는 로그인 페이지로 보낸다(작성은 로그인 필수).
  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthReady, isAuthenticated, router]);

  const handleSubmit = async ({ fields, thumbnail, images, files }: PortfolioFormSubmitValue) => {
    const created = await submit(
      BOARD_TYPE,
      {
        title: fields.title,
        description: fields.description,
        content: fields.content,
        videoLink: fields.videoLink,
        githubLink: fields.githubLink,
        visibility: fields.visibility,
        keywordIds: fields.keywordIds,
      },
      { thumbnail, images, files },
    );

    if (created) {
      router.push(`/portfolio/detail?id=${created.postId}&type=${created.boardType}`);
    }
  };

  // 인증 확인 전이거나 미인증(리다이렉트 대기) 상태에서는 폼을 노출하지 않는다.
  if (!isAuthReady || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-40">
          <Loading text="불러오는 중" size="large" />
        </div>
      </main>
    );
  }

  return (
    <PortfolioForm
      heading="포트폴리오 작성"
      headingDescription="프로젝트를 공유하고 다른 사람들과 소통하세요"
      submitLabel="저장하기"
      isSubmitting={isSubmitting}
      submitError={submitError}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/portfolio")}
    />
  );
};
