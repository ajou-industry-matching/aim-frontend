"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authRoleLabels, updateStoredSessionName } from "@/lib/auth";
import { useProfilePosts, type ProfilePostsTab } from "@/lib/posts";
import { useMyProfile } from "@/lib/user";
import { PortfolioList, type PortfolioListEmptyState } from "@/screens/portfolio";
import { Loading } from "@/shared/ui";
import { Avatar } from "@/shared/ui/avatars/avatars";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { UploadIcon } from "@/shared/ui/icons";
import { ProfileEditModal } from "./profile-edit-modal";

const tabItems: { id: ProfilePostsTab; label: string }[] = [
  { id: "my", label: "내 게시글" },
  { id: "liked", label: "좋아요한 게시글" },
];

const profileEmptyStates: Record<ProfilePostsTab, PortfolioListEmptyState> = {
  my: {
    variant: "no-content",
    title: "아직 작성한 게시글이 없습니다",
    description: "첫 포트폴리오를 업로드해보세요.",
  },
  liked: {
    variant: "no-content",
    title: "좋아요한 게시글이 없습니다",
    description: "마음에 드는 포트폴리오에 좋아요를 눌러보세요.",
  },
};

const containerClasses = "mx-auto max-w-[1440px] px-4 py-16";

// 상세 페이지와 동일한 밑줄형 탭 스타일 (호버 배경/텍스트 강조 없음)
const profileTabBaseClasses =
  "-mb-px border-b-2 px-6 py-3 text-[16px] font-medium leading-[1.5] tracking-[-0.4px] transition-colors";

const getProfileTabClasses = (isActive: boolean): string =>
  [
    profileTabBaseClasses,
    isActive
      ? "border-[var(--color-primary-800,#004a9c)] text-[var(--color-primary-800,#004a9c)]"
      : "border-transparent text-[var(--color-gray-600,#666)]",
  ].join(" ");

export const ProfileContent = () => {
  const router = useRouter();
  const { profile, isLoading, error, setProfile } = useMyProfile();
  const myPosts = useProfilePosts("my");
  const likedPosts = useProfilePosts("liked");
  const [activeTab, setActiveTab] = useState<ProfilePostsTab>("my");
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <Loading text="프로필을 불러오는 중" />
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-white">
        <div className={containerClasses}>
          <EmptyState
            variant="error"
            title="프로필을 불러오지 못했습니다"
            description="잠시 후 다시 시도해주세요."
            hasBackground
          />
        </div>
      </main>
    );
  }

  const activePosts = activeTab === "my" ? myPosts : likedPosts;

  return (
    <main className="min-h-screen bg-white">
      <div className={containerClasses}>
        {/* 프로필 헤더 */}
        <section className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-[60px]">
          <Avatar name={profile.name} size="3xl" className="flex-shrink-0" />

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[20px] text-[color:var(--color-gray-900,#111)]">
                {profile.name}
              </h1>
              <Button variant="secondary" size="medium" onClick={() => setIsEditOpen(true)}>
                프로필 편집
              </Button>
              <Button
                variant="primary"
                size="medium"
                icon={<UploadIcon />}
                iconPosition="left"
                onClick={() => router.push("/portfolio/create")}
              >
                포트폴리오 업로드
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-10">
              <div className="text-[16px] text-[color:var(--color-gray-900,#111)]">
                게시물 <span className="font-semibold">{profile.postCount}</span>
              </div>
              <div className="text-[16px] text-[color:var(--color-gray-900,#111)]">
                좋아요 <span className="font-semibold">{profile.likeCount}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[14px] font-semibold text-[color:var(--color-gray-900,#111)]">
                {profile.email}
              </span>
              <Badge variant="primary" size="small">
                {authRoleLabels[profile.role]}
              </Badge>
            </div>

            <p className="mt-3 text-[14px] text-[color:var(--color-gray-900,#111)]">
              {profile.department}
            </p>
            {profile.profileBio && (
              <p className="mt-1 text-[14px] text-[color:var(--color-gray-500,#666)]">
                {profile.profileBio}
              </p>
            )}
          </div>
        </section>

        {/* 탭 (상세 페이지와 동일한 밑줄 스타일) */}
        <div className="mt-10 flex border-b border-[var(--color-gray-200,#e5e5e5)]">
          {tabItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={getProfileTabClasses(activeTab === item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 게시글 그리드 */}
        <div className="mt-8">
          <PortfolioList
            portfolios={activePosts.posts}
            isLoading={activePosts.isLoading}
            error={activePosts.error?.message ?? null}
            emptyState={profileEmptyStates[activeTab]}
          />
        </div>
      </div>

      {isEditOpen && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setIsEditOpen(false)}
          onSaved={(updated) => {
            setProfile(updated);
            // 헤더 드롭다운이 세션의 name을 읽으므로 저장된 세션 이름도 함께 갱신한다.
            updateStoredSessionName(updated.name);
            setIsEditOpen(false);
          }}
        />
      )}
    </main>
  );
};
