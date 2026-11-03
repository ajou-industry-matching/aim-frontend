"use client";

import React, { useRef, useState } from "react";
import { UploadIcon, ImageIcon, XIcon, FileTextAltIcon } from "@/shared/ui/icons";
import { Button } from "@/shared/ui/button/button";

// --- Types ---

/** 한도 위반 항목 */
export type FileLimitViolation =
  | { reason: "size"; files: File[] }
  | { reason: "count"; count: number }
  | { reason: "total"; totalBytes: number };

export type FileLimits = {
  /** 개수 한도 */
  maxCount?: number;
  /** 크기 한도 (bytes) */
  maxSizeBytes?: number;
  /** 전체 크기 한도 (bytes) */
  maxTotalBytes?: number;
  /** 파일 개수 */
  currentCount?: number;
  /** 파일 크기 합 (bytes) */
  currentTotalBytes?: number;
};

export type FileUploaderProps = FileLimits & {
  label?: string;
  accept?: string;
  multiple?: boolean;
  hint?: string;
  onFileSelect: (files: File[]) => void;
  onReject?: (files: File[], violations: FileLimitViolation[]) => void;
  className?: string;
};

export type ThumbnailUploaderProps = {
  previewUrl?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  className?: string;
};

export type FileItem = {
  id: string;
  name: string;
  size: string;
  type?: string;
};

export type FileListItemProps = {
  file: FileItem;
  onRemove: (id: string) => void;
  className?: string;
};

// --- Styles ---

const uploaderBaseClasses =
  "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-200,#E0EDFB)] focus-visible:border-[var(--color-primary-500,#3385DB)]";

const getUploaderClasses = (heightClass: string, isDragging: boolean, className?: string) => {
  const dragClasses = isDragging
    ? "bg-[var(--color-primary-50,#EBF5FF)] border-[var(--color-primary-500,#3385DB)]"
    : "bg-white border-[var(--color-gray-300,#ccc)] hover:bg-[var(--color-gray-50,#f9f9f9)]";

  return [uploaderBaseClasses, heightClass, dragClasses, className].filter(Boolean).join(" ");
};

// --- Constants ---

const MB = 1024 * 1024;

export const POST_ATTACHMENT_LIMITS = {
  maxCount: 5,
  maxSizeBytes: 20 * MB,
  maxTotalBytes: 50 * MB,
} as const satisfies FileLimits;

// --- Utils ---

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
};

const formatLimitSize = (bytes: number): string =>
  bytes % MB === 0 ? `${bytes / MB}MB` : formatFileSize(bytes);

export const getFileLimitsHint = ({ maxCount, maxSizeBytes, maxTotalBytes }: FileLimits) => {
  const parts = [
    maxCount !== undefined && `최대 ${maxCount}개`,
    maxSizeBytes !== undefined && `파일당 ${formatLimitSize(maxSizeBytes)}`,
    maxTotalBytes !== undefined && `합계 ${formatLimitSize(maxTotalBytes)}`,
  ].filter(Boolean);
  if (parts.length === 0) return undefined;
  return maxSizeBytes === undefined && maxTotalBytes === undefined
    ? parts.join(", ")
    : `${parts.join(", ")} 이하`;
};

export const checkFileLimits = (
  files: File[],
  { maxCount, maxSizeBytes, maxTotalBytes, currentCount = 0, currentTotalBytes = 0 }: FileLimits,
): FileLimitViolation[] => {
  const violations: FileLimitViolation[] = [];

  const oversized = files.filter((file) => maxSizeBytes !== undefined && file.size > maxSizeBytes);
  if (oversized.length > 0) violations.push({ reason: "size", files: oversized });

  const count = currentCount + files.length;
  if (maxCount !== undefined && count > maxCount) violations.push({ reason: "count", count });

  const totalBytes = currentTotalBytes + files.reduce((sum, file) => sum + file.size, 0);
  if (maxTotalBytes !== undefined && totalBytes > maxTotalBytes) {
    violations.push({ reason: "total", totalBytes });
  }

  return violations;
};

export const formatFileLimitViolations = (
  violations: FileLimitViolation[],
  limits: FileLimits,
): string[] =>
  violations.map((violation) => {
    switch (violation.reason) {
      case "size": {
        const names = violation.files
          .map((file) => `${file.name}(${formatFileSize(file.size)})`)
          .join(", ");
        return `파일당 ${formatLimitSize(limits.maxSizeBytes ?? 0)}를 넘습니다: ${names}`;
      }
      case "count":
        return `최대 ${limits.maxCount}개까지 첨부할 수 있습니다 (첨부하면 ${violation.count}개)`;
      case "total":
        return (
          `첨부 파일 합계가 ${formatLimitSize(limits.maxTotalBytes ?? 0)}를 넘습니다 ` +
          `(첨부하면 ${formatFileSize(violation.totalBytes)})`
        );
    }
  });

/** 제출 직전 재검사. 문제가 없으면 null */
export const validateFiles = (
  files: File[],
  limits: FileLimits,
  { existingCount = 0, requestBytes = 0 }: { existingCount?: number; requestBytes?: number } = {},
): string | null => {
  const violations = checkFileLimits(files, {
    ...limits,
    currentCount: existingCount,
    currentTotalBytes: requestBytes,
  });
  if (violations.length === 0) return null;

  return violations
    .map((violation) => {
      if (violation.reason === "total" && requestBytes > 0) {
        const filesBytes = violation.totalBytes - requestBytes;
        return (
          `본문과 첨부 파일을 합친 크기가 ${formatLimitSize(limits.maxTotalBytes ?? 0)}를 넘습니다 ` +
          `(첨부 ${formatFileSize(filesBytes)}, 본문 ${formatFileSize(requestBytes)})`
        );
      }
      return formatFileLimitViolations([violation], limits)[0];
    })
    .join("\n");
};

// --- Components ---

// 1. Thumbnail Uploader (Large Image Upload)
export const ThumbnailUploader = ({
  previewUrl,
  onUpload,
  onRemove,
  className,
}: ThumbnailUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.currentTarget.value = ""; // 동일 파일 업로드 가능하게 초기화
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onUpload(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  if (previewUrl) {
    return (
      <div
        className={[
          "relative overflow-hidden rounded-lg w-full h-64 border border-[var(--color-gray-200,#e5e5ec)]",
          className,
        ].join(" ")}
      >
        <img src={previewUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
        <Button
          variant="danger"
          size="small"
          className="absolute top-2 right-2 w-8 h-8 p-0"
          onClick={onRemove}
          aria-label="Remove image"
        >
          <XIcon size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={getUploaderClasses("h-64", isDragging, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="썸네일 이미지 업로드"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="text-center pointer-events-none">
        <ImageIcon size={48} className="mx-auto mb-3 text-[var(--color-gray-400,#999)]" />
        <p className="text-[16px] font-medium text-[var(--color-gray-800,#333)]">
          썸네일 이미지 업로드
        </p>
        <p className="text-[14px] text-[var(--color-gray-500,#666)] mt-1">
          이미지를 드래그하거나 클릭하세요
        </p>
      </div>
    </div>
  );
};

// 2. File List Item (Uploaded file display)
export const FileListItem = ({ file, onRemove, className }: FileListItemProps) => {
  return (
    <div
      className={[
        "flex items-center justify-between p-4 bg-white border border-[var(--color-gray-200,#e5e5ec)] rounded-lg hover:bg-[var(--color-gray-50,#f9f9f9)] transition-colors duration-200",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="text-[var(--color-gray-400,#999)]">
          {file.type?.includes("image") ? <ImageIcon size={20} /> : <FileTextAltIcon size={20} />}
        </div>
        <div>
          <p className="text-[14px] font-medium text-[var(--color-gray-800,#333)] truncate max-w-[200px]">
            {file.name}
          </p>
          <p className="text-[12px] text-[var(--color-gray-500,#999)]">{file.size}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="p-1.5 text-[var(--color-gray-400,#999)] hover:text-[var(--color-error-500,#ef4444)] transition-colors"
        aria-label="Delete file"
      >
        <XIcon size={18} />
      </button>
    </div>
  );
};

// 3. General Multi-file Uploader Area
export const FileUploader = ({
  onFileSelect,
  onReject,
  accept,
  multiple = true,
  hint,
  maxCount,
  maxSizeBytes,
  maxTotalBytes,
  currentCount,
  currentTotalBytes,
  className,
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rejectMessages, setRejectMessages] = useState<string[]>([]);

  const limits: FileLimits = { maxCount, maxSizeBytes, maxTotalBytes };
  const hintText = hint ?? getFileLimitsHint(limits);

  const selectFiles = (files: File[]) => {
    if (files.length === 0) return;
    const violations = checkFileLimits(files, { ...limits, currentCount, currentTotalBytes });
    if (violations.length > 0) {
      setRejectMessages([
        `선택한 파일을 첨부할 수 없습니다.`,
        ...formatFileLimitViolations(violations, limits),
      ]);
      onReject?.(files, violations);
      return;
    }
    setRejectMessages([]);
    onFileSelect(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectFiles(Array.from(e.target.files || []));
    e.currentTarget.value = ""; // 초기화
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    selectFiles(Array.from(e.dataTransfer.files || []));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <>
      <div
        className={getUploaderClasses("h-32", isDragging, className)}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="파일 추가"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center pointer-events-none">
          <UploadIcon size={24} className="mb-2 text-[var(--color-gray-400,#999)]" />
          <p className="text-[14px] font-medium text-[var(--color-gray-600,#666)]">
            파일을 드래그하거나 클릭하여 추가
          </p>
          {hintText && (
            <p className="mt-1 text-[13px] text-[var(--color-gray-500,#999)]">{hintText}</p>
          )}
        </div>
      </div>
      {rejectMessages.length > 0 && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg bg-[var(--color-error-50,#fef2f2)] px-4 py-3 text-[14px] text-[var(--color-error-600,#dc2626)]"
        >
          <div className="flex flex-col gap-1">
            <p className="font-medium">{rejectMessages[0]}</p>
            <ul className="flex list-disc flex-col gap-1 pl-5">
              {rejectMessages.slice(1).map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => setRejectMessages([])}
            className="shrink-0 p-0.5 opacity-70 transition-opacity hover:opacity-100"
            aria-label="거부 안내 닫기"
          >
            <XIcon size={16} />
          </button>
        </div>
      )}
    </>
  );
};
