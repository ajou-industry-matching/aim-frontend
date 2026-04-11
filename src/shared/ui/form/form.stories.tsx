import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { FormField, FormLabel, FormHelperText, FormErrorMessage } from "./form";
import { Input, Textarea } from "../inputBox/inputBox";
import { Checkbox } from "../checkbox/checkbox";
import {
  ThumbnailUploader,
  FileListItem,
  FileUploader,
  type FileItem,
} from "../file-uploader/file-uploader";
import { Button } from "../button/button";

const meta = {
  title: "Shared/UI/Form",
  component: FormField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- 종합 폼 예시 (포트폴리오 작성) ---
const PortfolioCreateForm = () => {
  const [preview, setPreview] = useState<string | undefined>();
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "기획서_최종.pdf", size: "1.2 MB", type: "application/pdf" },
  ]);

  const handleFileSelect = (newFiles: File[]) => {
    const mappedFiles: FileItem[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type,
    }));
    setFiles((prev) => [...prev, ...mappedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="w-[640px] flex flex-col gap-10 bg-white p-10 border rounded-2xl shadow-sm my-10">
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-gray-900,#111)] mb-2">
          포트폴리오 작성
        </h1>
        <p className="text-[16px] text-[var(--color-gray-500,#666)]">
          당신의 멋진 프로젝트를 세상에 공유해 보세요.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="text-[20px] font-semibold text-[var(--color-gray-800,#333)] border-b pb-2">
          기본 정보
        </h2>

        <FormField>
          <FormLabel required>프로젝트 제목</FormLabel>
          <Input placeholder="프로젝트 제목을 입력하세요" />
        </FormField>

        <FormField>
          <FormLabel required>간단 설명</FormLabel>
          <Textarea placeholder="프로젝트를 2-3줄로 요약해 주세요" rows={3} />
          <FormHelperText>목록 페이지에서 카드 설명으로 사용됩니다.</FormHelperText>
        </FormField>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-[20px] font-semibold text-[var(--color-gray-800,#333)] border-b pb-2">
          미디어 및 파일
        </h2>

        <FormField>
          <FormLabel required>대표 썸네일</FormLabel>
          <ThumbnailUploader
            previewUrl={preview}
            onUpload={() => setPreview("https://picsum.photos/800/400")}
            onRemove={() => setPreview(undefined)}
          />
        </FormField>

        <FormField>
          <FormLabel>첨부 파일</FormLabel>
          <div className="flex flex-col gap-3 mb-4">
            {files.map((file) => (
              <FileListItem key={file.id} file={file} onRemove={removeFile} />
            ))}
          </div>
          <FileUploader onFileSelect={handleFileSelect} />
        </FormField>
      </section>

      <section className="bg-[var(--color-gray-50)] p-6 rounded-xl flex flex-col gap-4">
        <Checkbox label="운영 정책에 동의합니다." />
      </section>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="primary" size="large" className="px-10">
          작성 완료
        </Button>
      </div>
    </div>
  );
};

export const FullPortfolioForm: Story = {
  render: () => <PortfolioCreateForm />,
  args: {
    children: null,
  },
};

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <FormField>
        <FormLabel required>프로젝트 제목</FormLabel>
        <Input placeholder="프로젝트 제목을 입력하세요" />
      </FormField>
    </div>
  ),
  args: {
    children: null,
  },
};

export const WithError: Story = {
  render: () => (
    <div className="w-[400px]">
      <FormField>
        <FormLabel required>설명</FormLabel>
        <Textarea placeholder="상세 내용을 입력하세요" hasError />
        <FormErrorMessage>설명은 필수 항목입니다.</FormErrorMessage>
      </FormField>
    </div>
  ),
  args: {
    children: null,
  },
};
