"use client";

import type { PortfolioAttachment } from "@/api/posts";
import { DownloadIcon, FileTextAltIcon } from "@/shared/ui/icons";

export type PortfolioAttachmentsProps = {
  // 이미지(IMAGE) + 파일(FILE) 첨부를 모두 포함한다.
  attachments: PortfolioAttachment[];
};

const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

// figma design: 테두리 카드 행 (파일 아이콘 + 이름/용량 + 다운로드 링크)
const attachmentRowClasses =
  "flex items-center justify-between rounded-lg border border-[var(--color-gray-200,#e5e5e5)] p-4 transition-colors hover:bg-[var(--color-gray-50,#f9f9f9)]";

const downloadLinkClasses =
  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-[var(--color-primary-800,#004a9c)] transition-colors hover:bg-[var(--color-primary-50,#f0f6fd)]";

export const PortfolioAttachments = ({ attachments }: PortfolioAttachmentsProps) => {
  if (attachments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--color-gray-300,#cccccc)] p-8 text-center text-[14px] text-[var(--color-gray-500,#808080)]">
        첨부된 파일이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {attachments.map((attachment) => (
        <div key={attachment.attachmentId} className={attachmentRowClasses}>
          <div className="flex min-w-0 items-center gap-3">
            <FileTextAltIcon
              size={20}
              className="flex-shrink-0 text-[var(--color-primary-800,#004a9c)]"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[14px] font-medium leading-[1.43] tracking-[-0.35px] text-[var(--color-gray-800,#333333)]">
                {attachment.originalFilename}
              </span>
              <span className="text-[12px] leading-[1.33] tracking-[-0.3px] text-[var(--color-gray-400,#999999)]">
                {formatFileSize(attachment.fileSize)}
              </span>
            </div>
          </div>
          {/* download 속성은 동일 출처에서 강제 다운로드. Firebase 등 교차 출처면 새 탭 열람으로 폴백 */}
          <a
            href={attachment.filePath}
            download={attachment.originalFilename}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${attachment.originalFilename} 다운로드`}
            className={downloadLinkClasses}
          >
            <DownloadIcon size={16} />
          </a>
        </div>
      ))}
    </div>
  );
};
