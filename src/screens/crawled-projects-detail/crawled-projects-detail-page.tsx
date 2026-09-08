"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/lib/auth";
import {
  cloneCrawledProjectToPortfolio,
  type CrawledProjectResponse,
} from "@/api/crawled-projects";
import { Button } from "@/shared/ui/button/button";
import { Footer } from "@/shared/ui/footer";
import { RichEditor } from "@/shared/ui/rich-editor";
import { Tag } from "@/shared/ui/tag/tag";
import { ExternalLinkIcon } from "@/shared/ui/icons";

export interface CrawledProjectDetailPageProps {
  project: CrawledProjectResponse;
}

const sectionTitleClasses =
  "text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[var(--color-gray-900,#1a1a1a)]";

const openExternalLink = (url: string) => {
  if (typeof window === "undefined") return;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const CrawledProjectDetailPage = ({ project }: CrawledProjectDetailPageProps) => {
  const router = useRouter();
  const { session } = useAuthSession();
  const [isImporting, setIsImporting] = useState(false);
  const [hasImported, setHasImported] = useState(false);

  const isStudent = session?.role === "STUDENT";

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const postDetail = await cloneCrawledProjectToPortfolio(project.crawledProjectId);
      setHasImported(true);
      router.push(`/portfolio/detail?id=${postDetail.postId}&type=${postDetail.boardType}`);
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      if (
        (typeof err?.message === "string" &&
          err.message.includes("CRAWLED_PROJECT_MEMBER_REQUIRED")) ||
        err?.code === "CRAWLED_PROJECT_MEMBER_REQUIRED"
      ) {
        alert("이 크롤링 프로젝트의 참여자로 등록되어 있어야 포트폴리오로 가져올 수 있습니다.");
      } else {
        alert("포트폴리오 가져오기에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1440px] px-6 py-20 pt-[160px]">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-end">
            {isStudent && (
              <Button
                variant="primary"
                onClick={handleImport}
                isLoading={isImporting}
                disabled={hasImported}
              >
                {hasImported ? "가져오기 완료" : "포트폴리오로 가져오기"}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="relative aspect-[680/383] w-full flex-shrink-0 overflow-hidden rounded-xl bg-[var(--color-gray-100,#f2f2f2)] lg:h-[383px] lg:w-[680px]">
              {project.representativeImage ? (
                <img
                  src={project.representativeImage}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between gap-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  {project.term && (
                    <span className="text-[16px] font-medium text-gray-500">{project.term}</span>
                  )}
                  {project.term && project.category && <span className="text-gray-300">|</span>}
                  {project.category && <Tag>{project.category}</Tag>}
                </div>
                <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-1px] text-[var(--color-gray-800,#333)]">
                  {project.title}
                </h1>
                {(project.summary || project.description) && (
                  <p className="whitespace-pre-line text-[16px] leading-[1.5] tracking-[-0.4px] text-[var(--color-gray-600,#666)]">
                    {project.summary || project.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {project.sourceUrl && (
                  <Button
                    variant="secondary"
                    size="small"
                    isPill
                    iconPosition="right"
                    icon={<ExternalLinkIcon size={16} />}
                    onClick={() => openExternalLink(project.sourceUrl as string)}
                  >
                    출처
                  </Button>
                )}
                {project.presentationUrl && (
                  <Button
                    variant="secondary"
                    size="small"
                    isPill
                    iconPosition="right"
                    icon={<ExternalLinkIcon size={16} />}
                    onClick={() => openExternalLink(project.presentationUrl as string)}
                  >
                    발표자료
                  </Button>
                )}
                {project.videoUrl && (
                  <Button
                    variant="secondary"
                    size="small"
                    isPill
                    iconPosition="right"
                    icon={<ExternalLinkIcon size={16} />}
                    onClick={() => openExternalLink(project.videoUrl as string)}
                  >
                    시연영상
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    variant="secondary"
                    size="small"
                    isPill
                    iconPosition="right"
                    icon={<ExternalLinkIcon size={16} />}
                    onClick={() => openExternalLink(project.githubUrl as string)}
                  >
                    Github
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-20">
          <section className="flex flex-col gap-5">
            <h2 className={sectionTitleClasses}>상세 설명</h2>
            <div className="min-h-[200px]">
              <RichEditor content={project.content} isEditable={false} />
            </div>
          </section>

          {project.members && project.members.length > 0 && (
            <section className="flex flex-col gap-5">
              <h2 className={sectionTitleClasses}>참여 멤버</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.members.map((member, idx) => (
                  <div
                    key={`${member.maskedEmail}-${idx}`}
                    className="flex flex-col rounded-lg border border-gray-200 p-4"
                  >
                    <span className="font-semibold text-gray-900">{member.name}</span>
                    <span className="text-sm text-gray-500">{member.maskedEmail}</span>
                    <span className="mt-2 text-sm text-gray-700">
                      {member.department} {member.grade}
                    </span>
                    {member.role && (
                      <span className="mt-1 text-sm font-medium text-[var(--color-primary-800,#004a9c)]">
                        {member.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex justify-center pb-20 pt-10">
            <Button variant="primary" size="large" onClick={() => router.push("/crawled-projects")}>
              목록
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
