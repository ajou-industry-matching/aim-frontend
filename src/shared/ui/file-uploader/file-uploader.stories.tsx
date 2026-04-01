import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThumbnailUploader, FileListItem, FileUploader } from "./file-uploader";

const meta = {
  title: "Shared/UI/FileUploader",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

const ThumbnailContainer = () => {
  const [preview, setPreview] = useState<string | undefined>();
  return (
    <div className="w-[400px]">
      <ThumbnailUploader
        previewUrl={preview}
        onUpload={() => setPreview("https://picsum.photos/800/400")}
        onRemove={() => setPreview(undefined)}
      />
    </div>
  );
};

export const Thumbnail: StoryObj<typeof ThumbnailUploader> = {
  render: () => <ThumbnailContainer />,
};

export const FileList: StoryObj<typeof FileListItem> = {
  render: () => (
    <div className="w-[400px] flex flex-col gap-3">
      <FileListItem
        file={{ id: "1", name: "project-proposal.pdf", size: "2.4 MB", type: "application/pdf" }}
        onRemove={(id) => console.log("Remove", id)}
      />
      <FileListItem
        file={{ id: "2", name: "main-screenshot.png", size: "1.1 MB", type: "image/png" }}
        onRemove={(id) => console.log("Remove", id)}
      />
    </div>
  ),
};

export const CombinedUploader: StoryObj = {
  render: () => {
    return (
      <div className="w-[500px] flex flex-col gap-6 p-8 bg-white border rounded-xl">
        <div>
          <h3 className="text-lg font-bold mb-4">포트폴리오 미디어</h3>
          <p className="text-sm text-gray-500 mb-4">대표 이미지는 검색 결과에 노출됩니다.</p>
          <ThumbnailUploader onUpload={() => {}} onRemove={() => {}} />
        </div>

        <div>
          <h3 className="text-md font-semibold mb-3">첨부 파일</h3>
          <div className="flex flex-col gap-3 mb-4">
            <FileListItem
              file={{ id: "1", name: "guide.pdf", size: "1.2MB" }}
              onRemove={() => {}}
            />
          </div>
          <FileUploader onFileSelect={() => {}} />
        </div>
      </div>
    );
  },
};
