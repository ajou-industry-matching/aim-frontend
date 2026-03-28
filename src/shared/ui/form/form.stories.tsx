import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField, FormLabel, FormHelperText, FormErrorMessage } from "./form";
import { Input, Textarea } from "@/shared/ui/inputBox/inputBox";
import { Checkbox } from "@/shared/ui/checkbox/checkbox";
import {
  ThumbnailUploader,
  FileListItem,
  FileUploader,
} from "@/shared/ui/file-uploader/file-uploader";
import { Button } from "@/shared/ui/button/button";

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
  const [files, setFiles] = useState([
    { id: "1", name: "기획서_최종.pdf", size: "1.2 MB", type: "application/pdf" },
  ]);

  return (
    <div className="w-[640px] flex flex-col gap-10 bg-white p-10 border rounded-2xl shadow-sm my-10">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-gray-900,#111)] mb-2">
          포트폴리오 작성
        </h1>
        <p className="text-[16px] text-[var(--color-gray-500,#666)]">
          당신의 멋진 프로젝트를 세상에 공유해 보세요.
        </p>
      </div>

      {/* Basic Info Section */}
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

        <div className="flex gap-4">
          <FormField className="flex-1">
            <FormLabel>기술 스택</FormLabel>
            <Input placeholder="예: React, TypeScript" />
          </FormField>
          <FormField className="flex-1">
            <FormLabel>역할</FormLabel>
            <Input placeholder="예: 프론트엔드 개발" />
          </FormField>
        </div>
      </section>

      {/* Media Section */}
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
          <FormHelperText>권장 해상도: 1200 x 630 (1.91:1)</FormHelperText>
        </FormField>

        <FormField>
          <FormLabel>첨부 파일</FormLabel>
          <div className="flex flex-col gap-3 mb-4">
            {files.map((file) => (
              <FileListItem
                key={file.id}
                file={file}
                onRemove={(id) => setFiles(files.filter((f) => f.id !== id))}
              />
            ))}
          </div>
          <FileUploader onFileSelect={() => {}} />
        </FormField>
      </section>

      {/* Policy Section */}
      <section className="bg-[var(--color-gray-50)] p-6 rounded-xl flex flex-col gap-4">
        <Checkbox label="위 프로젝트 내용이 사실임을 확인하며, 아주대학교 포트폴리오 운영 정책에 동의합니다." />
        <Checkbox
          label="프로젝트를 전체 공개로 설정합니다. (체크 해제 시 나만 보기)"
          defaultChecked
        />
      </section>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="ghost" size="large" className="px-8">
          임시 저장
        </Button>
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

// --- 기존 개별 스토리 ---
export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <FormField>
        <FormLabel required>프로젝트 제목</FormLabel>
        <Input placeholder="프로젝트 제목을 입력하세요" />
        <FormHelperText>다른 사람들이 쉽게 알 수 있는 제목을 정해주세요.</FormHelperText>
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
