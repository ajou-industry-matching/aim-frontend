import React, { useRef } from "react";
import { UploadIcon, ImageIcon, XIcon, FileTextIcon } from "@/shared/ui/icons";
import { Button } from "@/shared/ui/button/button";

// --- Types ---

export type FileUploaderProps = {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
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
  "flex flex-col items-center justify-center w-full border-2 border-dashed border-[var(--color-gray-300,#ccc)] rounded-lg cursor-pointer hover:bg-[var(--color-gray-50,#f9f9f9)] transition-colors duration-200 group";

const getUploaderClasses = (heightClass: string, className?: string) => {
  return [uploaderBaseClasses, heightClass, className].filter(Boolean).join(" ");
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

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
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
    <div className={getUploaderClasses("h-64", className)} onClick={handleClick}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="text-center">
        <ImageIcon
          size={48}
          className="mx-auto mb-3 text-[var(--color-gray-400,#999)] group-hover:text-[var(--color-primary-500)] transition-colors"
        />
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
          {file.type?.includes("image") ? <ImageIcon size={20} /> : <FileTextIcon size={20} />}
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
  accept,
  multiple = true,
  className,
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onFileSelect(files);
  };

  return (
    <div
      className={getUploaderClasses("h-32", className)}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center">
        <UploadIcon size={24} className="mb-2 text-[var(--color-gray-400,#999)]" />
        <p className="text-[14px] font-medium text-[var(--color-gray-600,#666)]">파일 추가</p>
      </div>
    </div>
  );
};
