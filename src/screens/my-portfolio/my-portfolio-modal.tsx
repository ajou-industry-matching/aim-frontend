"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toCategoryLabel, useMyCrawledProjects } from "@/lib/crawled-projects";
import { Button, Input, Modal, ModalContent, ModalFooter, ModalHeader } from "@/shared/ui";
import { EmptyState } from "@/shared/ui/empty-states/empty-states";
import { CheckIcon, PlusIcon, SearchIcon } from "@/shared/ui/icons";
import { Loading } from "@/shared/ui/loading";
import { Tag } from "@/shared/ui/tag";

// 백엔드가 가져온 글을 공개 상태로 만든다. 저장 방식이 바뀌면 이 문구도 함께 바꾼다.
const IMPORT_NOTICE =
  "수집된 프로젝트 중 본인 참여가 확인된 항목입니다. 가져오면 내 포트폴리오에 바로 공개됩니다.";

const importedLinkClasses =
  "flex h-9 items-center justify-center gap-1 rounded-lg bg-[var(--color-gray-100,#f2f2f2)] text-[13px] font-medium text-[var(--color-gray-700,#4d4d4d)] hover:bg-[var(--color-gray-200,#e5e5e5)]";

export type MyPortfolioModalProps = {
  onClose: () => void;
};

export const MyPortfolioModal = ({ onClose }: MyPortfolioModalProps) => {
  const { projects, isLoading, loadError, importingId, importError, importProject } =
    useMyCrawledProjects();
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return projects;
    return projects.filter((project) => project.title.toLowerCase().includes(keyword));
  }, [projects, query]);

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-16">
          <Loading text="프로젝트를 불러오는 중" />
        </div>
      );
    }

    if (loadError) {
      return <EmptyState variant="error" title="불러오지 못했습니다" description={loadError} />;
    }

    if (projects.length === 0) {
      return (
        <EmptyState
          variant="no-content"
          title="가져올 프로젝트가 없습니다"
          description="가입한 이름과 아주대 이메일이 일치하는 프로젝트만 표시됩니다."
        />
      );
    }

    if (filteredProjects.length === 0) {
      return (
        <EmptyState variant="no-results" title={`'${query.trim()}'에 대한 검색 결과가 없습니다`} />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredProjects.map((project) => (
          <div key={project.crawledProjectId} className="flex flex-col">
            <div className="relative aspect-[360/203] w-full overflow-hidden rounded-t-xl border border-b-0 border-[var(--color-gray-200,#e5e5e5)] bg-[var(--color-gray-100,#f2f2f2)]">
              {project.representativeImage && (
                <Image
                  src={project.representativeImage}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 rounded-b-xl border border-[var(--color-gray-200,#e5e5e5)] bg-white p-4">
              {project.category && (
                <div>
                  <Tag>{toCategoryLabel(project.category)}</Tag>
                </div>
              )}
              <h3 className="line-clamp-2 flex-1 text-[16px] font-semibold leading-[1.4] text-[var(--color-gray-800,#333333)]">
                {project.title}
              </h3>
              {project.portfolioPostId !== null ? (
                <Link
                  href={`/portfolio/detail?id=${project.portfolioPostId}&type=PORTFOLIO`}
                  onClick={onClose}
                  className={importedLinkClasses}
                >
                  <CheckIcon size={16} />
                  가져옴 · 글 보기
                </Link>
              ) : (
                <Button
                  size="small"
                  fullWidth
                  isLoading={importingId === project.crawledProjectId}
                  disabled={importingId !== null}
                  iconPosition="left"
                  icon={<PlusIcon size={16} />}
                  onClick={() => void importProject(project.crawledProjectId)}
                >
                  가져오기
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal isOpen onClose={onClose} className="max-w-[720px]">
      <ModalHeader title="내 포트폴리오" onClose={onClose} />
      <ModalContent className="space-y-4">
        <p className="text-[14px] leading-[1.43] text-[var(--color-gray-600,#666666)]">
          {IMPORT_NOTICE}
        </p>
        <Input
          size="medium"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="프로젝트명으로 검색"
          leftIcon={<SearchIcon size={16} />}
          isFullWidth
        />
        {importError && (
          <p role="alert" className="text-[13px] text-[var(--color-error-500,#ef4444)]">
            {importError}
          </p>
        )}
        <div className="max-h-[50vh] overflow-y-auto">{renderBody()}</div>
      </ModalContent>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </ModalFooter>
    </Modal>
  );
};
