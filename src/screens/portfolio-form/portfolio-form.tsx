"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortfolioAttachment, PortfolioVisibility } from "@/api/posts";
import { useKeywords } from "@/lib/posts";
import { Button } from "@/shared/ui/button/button";
import {
  FileListItem,
  FileUploader,
  ThumbnailUploader,
} from "@/shared/ui/file-uploader/file-uploader";
import { FormErrorMessage, FormField, FormHelperText, FormLabel } from "@/shared/ui/form/form";
import { Input, Select, Textarea } from "@/shared/ui/input/input";
import { RichEditor } from "@/shared/ui/rich-editor";
import { Tag } from "@/shared/ui/tag/tag";
import { XIcon } from "@/shared/ui/icons";

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 200;
const ATTACHMENT_ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.zip,.hwp,.txt";

export type PortfolioFormInitialValues = {
  title: string;
  description: string;
  content: string;
  videoLink: string;
  githubLink: string;
  visibility: PortfolioVisibility;
  keywordIds: number[];
};

export type PortfolioFormSubmitValue = {
  fields: {
    title: string;
    description?: string;
    content?: string;
    videoLink?: string;
    githubLink?: string;
    visibility: PortfolioVisibility;
    keywordIds: number[];
  };
  thumbnail: File | null;
  images: File[];
  files: File[];
  deleteAttachmentIds: number[];
};

export type PortfolioFormProps = {
  heading: string;
  headingDescription: string;
  submitLabel: string;
  isSubmitting: boolean;
  submitError: Error | null;
  onSubmit: (value: PortfolioFormSubmitValue) => void;
  onCancel: () => void;
  initialValues?: PortfolioFormInitialValues;
  existingThumbnailUrl?: string | null;
  existingImages?: PortfolioAttachment[];
  existingFiles?: PortfolioAttachment[];
};

type FieldName =
  | "title"
  | "description"
  | "content"
  | "keywords"
  | "thumbnail"
  | "videoLink"
  | "githubLink";
type FieldErrors = Partial<Record<FieldName, string>>;

const DEFAULT_INITIAL_VALUES: PortfolioFormInitialValues = {
  title: "",
  description: "",
  content: "",
  videoLink: "",
  githubLink: "",
  visibility: "PUBLIC",
  keywordIds: [],
};

const sectionTitleClasses =
  "text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[var(--color-gray-900,#1a1a1a)]";

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;
  return `${(kilobytes / 1024).toFixed(1)} MB`;
};

const isRichTextEmpty = (html: string): boolean =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, "")
    .trim().length === 0;

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const PortfolioForm = ({
  heading,
  headingDescription,
  submitLabel,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
  initialValues = DEFAULT_INITIAL_VALUES,
  existingThumbnailUrl = null,
  existingImages = [],
  existingFiles = [],
}: PortfolioFormProps) => {
  const { keywords } = useKeywords();

  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [content, setContent] = useState(initialValues.content);
  const [videoLink, setVideoLink] = useState(initialValues.videoLink);
  const [githubLink, setGithubLink] = useState(initialValues.githubLink);
  const [keywordIds, setKeywordIds] = useState<number[]>(initialValues.keywordIds);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<number[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [tagSelectKey, setTagSelectKey] = useState(0);

  // 미리보기 objectURL은 렌더 시 파생하고, cleanup에서만 revoke한다.
  const newThumbnailPreview = useMemo(
    () => (thumbnail ? URL.createObjectURL(thumbnail) : null),
    [thumbnail],
  );
  useEffect(() => {
    if (!newThumbnailPreview) return;
    return () => URL.revokeObjectURL(newThumbnailPreview);
  }, [newThumbnailPreview]);

  const imagePreviews = useMemo(() => images.map((image) => URL.createObjectURL(image)), [images]);
  useEffect(() => {
    return () => imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  const thumbnailPreview = newThumbnailPreview ?? existingThumbnailUrl;

  const visibleExistingImages = existingImages.filter(
    (attachment) => !removedAttachmentIds.includes(attachment.attachmentId),
  );
  const visibleExistingFiles = existingFiles.filter(
    (attachment) => !removedAttachmentIds.includes(attachment.attachmentId),
  );

  const selectedKeywords = keywords.filter((keyword) => keywordIds.includes(keyword.keywordId));
  const availableKeywordOptions = keywords
    .filter((keyword) => !keywordIds.includes(keyword.keywordId))
    .map((keyword) => ({ label: keyword.keywordName, value: keyword.keywordId }));

  const handleAddKeyword = (keywordId: number) => {
    if (!Number.isInteger(keywordId) || keywordIds.includes(keywordId)) return;
    setKeywordIds((prev) => [...prev, keywordId]);
    setTagSelectKey((key) => key + 1);
  };

  const handleRemoveKeyword = (keywordId: number) => {
    setKeywordIds((prev) => prev.filter((id) => id !== keywordId));
  };

  const handleRemoveExistingAttachment = (attachmentId: number) => {
    setRemovedAttachmentIds((prev) => [...prev, attachmentId]);
  };

  const handleValidateAndSubmit = () => {
    const errors: FieldErrors = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      errors.title = "프로젝트 제목을 입력해주세요.";
    } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      errors.title = `제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요.`;
    }

    if (!description.trim()) {
      errors.description = "간단 설명을 입력해주세요.";
    }

    if (isRichTextEmpty(content)) {
      errors.content = "프로젝트 상세 설명을 입력해주세요.";
    }

    if (keywordIds.length === 0) {
      errors.keywords = "태그를 1개 이상 선택해주세요.";
    }

    if (!thumbnail && !existingThumbnailUrl) {
      errors.thumbnail = "썸네일 이미지를 등록해주세요.";
    }

    const trimmedVideoLink = videoLink.trim();
    if (trimmedVideoLink && !isValidHttpUrl(trimmedVideoLink)) {
      errors.videoLink = "올바른 URL 형식이 아닙니다.";
    }

    const trimmedGithubLink = githubLink.trim();
    if (trimmedGithubLink && !isValidHttpUrl(trimmedGithubLink)) {
      errors.githubLink = "올바른 URL 형식이 아닙니다.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    onSubmit({
      fields: {
        title: trimmedTitle,
        description: description.trim() || undefined,
        content: content || undefined,
        videoLink: trimmedVideoLink || undefined,
        githubLink: trimmedGithubLink || undefined,
        visibility: initialValues.visibility,
        keywordIds,
      },
      thumbnail,
      images,
      files,
      deleteAttachmentIds: removedAttachmentIds,
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-12 md:px-8">
        {/* 헤더 */}
        <div>
          <h1 className="mb-2 text-[40px] font-bold leading-[1.3] tracking-[-1px] text-[var(--color-gray-800,#333)]">
            {heading}
          </h1>
          <p className="text-[16px] leading-[1.5] tracking-[-0.4px] text-[var(--color-gray-600,#666)]">
            {headingDescription}
          </p>
        </div>

        {/* 기본 정보 */}
        <section className="flex flex-col gap-6">
          <h2 className={sectionTitleClasses}>기본 정보</h2>

          <FormField>
            <FormLabel htmlFor="portfolio-title" required>
              프로젝트 제목
            </FormLabel>
            <Input
              id="portfolio-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="프로젝트 제목을 입력하세요"
              maxLength={MAX_TITLE_LENGTH}
              hasError={Boolean(fieldErrors.title)}
            />
            {fieldErrors.title && <FormErrorMessage>{fieldErrors.title}</FormErrorMessage>}
          </FormField>

          <FormField>
            <FormLabel htmlFor="portfolio-description" required>
              간단 설명
            </FormLabel>
            <Textarea
              id="portfolio-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="프로젝트를 2-3줄로 간단히 요약해주세요"
              rows={3}
              maxLength={MAX_DESCRIPTION_LENGTH}
              hasError={Boolean(fieldErrors.description)}
              className="min-h-[96px]"
            />
            {fieldErrors.description && (
              <FormErrorMessage>{fieldErrors.description}</FormErrorMessage>
            )}
          </FormField>

          <FormField>
            <FormLabel required>태그</FormLabel>
            <Select
              key={tagSelectKey}
              placeholder="태그를 선택하세요"
              options={availableKeywordOptions}
              onChange={(event) => handleAddKeyword(Number(event.target.value))}
            />
            {selectedKeywords.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedKeywords.map((keyword) => (
                  <Tag
                    key={keyword.keywordId}
                    onRemove={() => handleRemoveKeyword(keyword.keywordId)}
                  >
                    {`#${keyword.keywordName}`}
                  </Tag>
                ))}
              </div>
            )}
            {fieldErrors.keywords && <FormErrorMessage>{fieldErrors.keywords}</FormErrorMessage>}
          </FormField>
        </section>

        {/* 상세 내용 */}
        <section className="flex flex-col gap-6">
          <h2 className={sectionTitleClasses}>상세 내용</h2>

          <FormField>
            <FormLabel required>프로젝트 상세 설명</FormLabel>
            <FormHelperText>/ 를 입력하여 다양한 포맷을 사용할 수 있습니다</FormHelperText>
            <RichEditor
              content={initialValues.content}
              onChange={(html) => setContent(html)}
              placeholder="프로젝트를 자유롭게 소개해주세요"
              className="min-h-[300px]"
            />
            {fieldErrors.content && <FormErrorMessage>{fieldErrors.content}</FormErrorMessage>}
          </FormField>
        </section>

        {/* 미디어 및 링크 */}
        <section className="flex flex-col gap-6">
          <h2 className={sectionTitleClasses}>미디어 및 링크</h2>

          <FormField>
            <FormLabel required>썸네일 이미지</FormLabel>
            <ThumbnailUploader
              previewUrl={thumbnailPreview ?? undefined}
              onUpload={(file) => setThumbnail(file)}
              onRemove={() => setThumbnail(null)}
            />
            {fieldErrors.thumbnail && <FormErrorMessage>{fieldErrors.thumbnail}</FormErrorMessage>}
          </FormField>

          <FormField>
            <FormLabel>추가 이미지</FormLabel>
            <FileUploader
              accept="image/*"
              multiple
              onFileSelect={(selected) => setImages((prev) => [...prev, ...selected])}
            />
            {(visibleExistingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                {visibleExistingImages.map((attachment) => (
                  <div
                    key={`existing-image-${attachment.attachmentId}`}
                    className="group relative aspect-video overflow-hidden rounded-lg border border-[var(--color-gray-200,#e5e5e5)]"
                  >
                    {/* 서버 이미지 미리보기 (상세 페이지와 동일 방식) */}
                    <img
                      src={attachment.filePath}
                      alt={attachment.originalFilename}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="danger"
                      size="small"
                      className="absolute right-2 top-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleRemoveExistingAttachment(attachment.attachmentId)}
                      aria-label={`${attachment.originalFilename} 삭제`}
                    >
                      <XIcon size={16} />
                    </Button>
                  </div>
                ))}
                {imagePreviews.map((previewUrl, index) => (
                  <div
                    key={previewUrl}
                    className="group relative aspect-video overflow-hidden rounded-lg border border-[var(--color-gray-200,#e5e5e5)]"
                  >
                    {/* blob URL 미리보기라 next/image 대신 img 사용 */}
                    <img
                      src={previewUrl}
                      alt={`추가 이미지 ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="danger"
                      size="small"
                      className="absolute right-2 top-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                      aria-label={`추가 이미지 ${index + 1} 삭제`}
                    >
                      <XIcon size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="portfolio-video-link">시연 영상 URL</FormLabel>
            <Input
              id="portfolio-video-link"
              type="url"
              value={videoLink}
              onChange={(event) => setVideoLink(event.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              hasError={Boolean(fieldErrors.videoLink)}
            />
            {fieldErrors.videoLink && <FormErrorMessage>{fieldErrors.videoLink}</FormErrorMessage>}
          </FormField>

          <FormField>
            <FormLabel htmlFor="portfolio-github-link">GitHub URL</FormLabel>
            <Input
              id="portfolio-github-link"
              type="url"
              value={githubLink}
              onChange={(event) => setGithubLink(event.target.value)}
              placeholder="https://github.com/username/repo"
              hasError={Boolean(fieldErrors.githubLink)}
            />
            {fieldErrors.githubLink && (
              <FormErrorMessage>{fieldErrors.githubLink}</FormErrorMessage>
            )}
          </FormField>

          <FormField>
            <FormLabel>첨부파일</FormLabel>
            <FileUploader
              accept={ATTACHMENT_ACCEPT}
              multiple
              onFileSelect={(selected) => setFiles((prev) => [...prev, ...selected])}
            />
            {(visibleExistingFiles.length > 0 || files.length > 0) && (
              <div className="mt-4 flex flex-col gap-2">
                {visibleExistingFiles.map((attachment) => (
                  <FileListItem
                    key={`existing-file-${attachment.attachmentId}`}
                    file={{
                      id: `existing-${attachment.attachmentId}`,
                      name: attachment.originalFilename,
                      size: formatFileSize(attachment.fileSize),
                      type: attachment.fileType,
                    }}
                    onRemove={() => handleRemoveExistingAttachment(attachment.attachmentId)}
                  />
                ))}
                {files.map((file, index) => (
                  <FileListItem
                    key={`${file.name}-${index}`}
                    file={{
                      id: String(index),
                      name: file.name,
                      size: formatFileSize(file.size),
                      type: file.type,
                    }}
                    onRemove={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                  />
                ))}
              </div>
            )}
          </FormField>
        </section>

        {/* 제출 */}
        <div className="flex flex-col gap-3 border-t border-[var(--color-gray-200,#e5e5e5)] pt-6">
          {submitError && <FormErrorMessage>{submitError.message}</FormErrorMessage>}
          <div className="flex justify-end gap-4">
            <Button variant="secondary" size="large" onClick={onCancel} disabled={isSubmitting}>
              취소
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={handleValidateAndSubmit}
              isLoading={isSubmitting}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
