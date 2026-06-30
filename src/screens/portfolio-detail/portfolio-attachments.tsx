"use client";

import type { PortfolioAttachment } from "@/api/posts";
import { ListItem } from "@/shared/ui/lists/lists";

export type PortfolioAttachmentsProps = {
  files: PortfolioAttachment[];
};

const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const openAttachment = (filePath: string) => {
  if (typeof window === "undefined") return;
  window.open(filePath, "_blank", "noopener,noreferrer");
};

export const PortfolioAttachments = ({ files }: PortfolioAttachmentsProps) => {
  if (files.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--color-gray-300,#cccccc)] p-8 text-center text-[14px] text-[var(--color-gray-500,#808080)]">
        첨부된 파일이 없습니다.
      </div>
    );
  }

  const fileByAttachmentId = new Map(files.map((file) => [String(file.attachmentId), file]));

  return (
    <div className="flex flex-col gap-2">
      {files.map((file) => (
        <ListItem
          key={file.attachmentId}
          id={String(file.attachmentId)}
          title={file.originalFilename}
          metaPrimary={formatFileSize(file.fileSize)}
          hasArrow
          onClick={(id) => {
            const target = fileByAttachmentId.get(id);
            if (target) openAttachment(target.filePath);
          }}
        />
      ))}
    </div>
  );
};
