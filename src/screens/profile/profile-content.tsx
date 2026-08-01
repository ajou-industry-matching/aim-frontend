"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthRole } from "@/api/auth";
import { useProfilePosts, type ProfilePostsTab } from "@/lib/posts";
import { useMyProfile } from "@/lib/user";
import { Loading, Tabs, type TabItem } from "@/shared/ui";
import { Avatar } from "@/shared/ui/avatars/avatars";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { UploadIcon } from "@/shared/ui/icons";
import { ProfileEditModal } from "./profile-edit-modal";
import { ProfilePostsGrid } from "./profile-posts-grid";

const roleLabels: Record<AuthRole, string> = {
  STUDENT: "학생",
  PROFESSOR: "교수",
  COMPANY: "기업",
};

const tabItems: TabItem[] = [
  { id: "my", label: "내 게시글" },
  { id: "liked", label: "좋아요한 게시글" },
];

const containerClasses = "mx-auto max-w-[1440px] px-4 py-16";

export const ProfileContent = () => {
  const router = useRouter();
  const { profile, isLoading, error, setProfile } = useMyProfile();
  const myPosts = useProfilePosts("my");
  const likedPosts = useProfilePosts("liked");
  const [activeTab, setActiveTab] = useState<ProfilePostsTab>("my");
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className={`${containerClasses} flex items-center justify-center`}>
          <Loading text="프로필을 불러오는 중" />
        </div>
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
                {roleLabels[profile.role]}
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

        {/* 탭 */}
        <div className="mt-10">
          <Tabs
            items={tabItems}
            value={activeTab}
            variant="horizontal"
            onChange={(id) => setActiveTab(id as ProfilePostsTab)}
          />
        </div>

        {/* 게시글 그리드 */}
        <div className="mt-8">
          {activeTab === "my" ? (
            <ProfilePostsGrid
              posts={activePosts.posts}
              isLoading={activePosts.isLoading}
              error={activePosts.error?.message ?? null}
              emptyTitle="아직 작성한 게시글이 없습니다"
              emptyDescription="첫 포트폴리오를 업로드해보세요."
            />
          ) : (
            <ProfilePostsGrid
              posts={activePosts.posts}
              isLoading={activePosts.isLoading}
              error={activePosts.error?.message ?? null}
              emptyTitle="좋아요한 게시글이 없습니다"
              emptyDescription="마음에 드는 포트폴리오에 좋아요를 눌러보세요."
            />
          )}
        </div>
      </div>

      {isEditOpen && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setIsEditOpen(false)}
          onSaved={(updated) => {
            setProfile(updated);
            setIsEditOpen(false);
          }}
        />
      )}
    </main>
  );
};
