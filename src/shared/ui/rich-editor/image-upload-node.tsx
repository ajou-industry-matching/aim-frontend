"use client";

import {
  Node,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type Editor,
  type NodeViewProps,
} from "@tiptap/react";
import { ImageIcon } from "@/shared/ui/icons";
import { Spinner } from "@/shared/ui/spinner/spinner";

export const IMAGE_UPLOAD_NODE_NAME = "imageUpload";

export type ImageUploadStorage = {
  /** RichEditor가 onUploadImage를 넣어둔다. 슬래시 명령이 렌더 밖에서 꺼내 쓴다. */
  upload: ((file: File) => Promise<string>) | null;
};

type Uploader = ImageUploadStorage["upload"];

// @tiptap/core는 직접 의존성이 아니라 Storage 타입 확장 대신 이 두 함수로만 접근한다.
const getUploadStorage = (editor: Editor): ImageUploadStorage =>
  (editor.storage as unknown as Record<typeof IMAGE_UPLOAD_NODE_NAME, ImageUploadStorage>)[
    IMAGE_UPLOAD_NODE_NAME
  ];

export const getImageUploader = (editor: Editor): Uploader => getUploadStorage(editor).upload;

export const setImageUploader = (editor: Editor, upload: Uploader): void => {
  getUploadStorage(editor).upload = upload;
};

export type ImageUploadStatus = "uploading" | "error";

// 저장되는 본문에는 남기지 않는다. onChange로 넘기기 전에 이 패턴으로 걷어낸다.
export const IMAGE_UPLOAD_HTML_PATTERN = /<div[^>]*data-image-upload[^>]*><\/div>/g;

const uploadBlockClasses =
  "my-3 flex w-full items-center gap-4 rounded-xl bg-[var(--color-gray-100,#f2f2f2)] px-4 py-3.5";

const ImageUploadView = ({ node, deleteNode }: NodeViewProps) => {
  const status = node.attrs.status as ImageUploadStatus;
  const message = node.attrs.message as string | null;

  if (status === "uploading") {
    return (
      <NodeViewWrapper contentEditable={false} className={uploadBlockClasses}>
        <ImageIcon size={22} className="shrink-0 text-[var(--color-gray-500,#808080)]" />
        <span role="status" className="flex-1 text-[15px] text-[var(--color-gray-500,#808080)]">
          이미지를 올리는 중
        </span>
        <Spinner size="small" className="shrink-0 text-[var(--color-gray-400,#999999)]" />
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper contentEditable={false} className={uploadBlockClasses}>
      <ImageIcon size={22} className="shrink-0 text-[var(--color-error-500,#ef4444)]" />
      <span role="alert" className="flex-1 text-[15px] text-[var(--color-error-500,#ef4444)]">
        {message}
      </span>
      <button
        type="button"
        onClick={deleteNode}
        className="shrink-0 rounded px-2 py-1 text-[13px] text-[var(--color-gray-500,#808080)] hover:bg-[var(--color-gray-200,#e5e5e5)]"
      >
        지우기
      </button>
    </NodeViewWrapper>
  );
};

/**
 * 이미지가 올라가는 동안 본문 안 그 자리에 보이는 자리표시 블록(Notion 방식).
 * 업로드가 끝나면 같은 자리를 이미지로 바꾸므로, 그사이 커서가 움직여도 이미지 위치가 틀어지지 않는다.
 */
export const ImageUploadNode = Node.create({
  name: IMAGE_UPLOAD_NODE_NAME,
  group: "block",
  atom: true,
  selectable: true,

  addStorage(): ImageUploadStorage {
    return { upload: null };
  },

  addAttributes() {
    return {
      uploadId: { default: null },
      status: { default: "uploading" },
      message: { default: null },
    };
  },

  // 저장된 본문에서 다시 읽어 들일 일이 없으므로 파싱 규칙을 두지 않는다.
  parseHTML() {
    return [];
  },

  renderHTML() {
    return ["div", { "data-image-upload": "" }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadView);
  },
});
