"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import AutoJoiner from "tiptap-extension-auto-joiner";

import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListBulletIcon,
  ListOrderedIcon,
  QuoteIcon,
  CodeIcon,
  ImageIcon,
} from "@/shared/ui/icons";
import { Loading } from "@/shared/ui/loading";

import { SlashCommand, filterSuggestionItems, type SlashCommandItem } from "./slash-command";
import { SlashCommandMenu } from "./slash-command-menu";
import { EditorImageUploadError, uploadEditorImage } from "./upload-editor-image";

export type RichEditorProps = {
  content?: string;
  onChange?: (html: string) => void;
  isEditable?: boolean;
  placeholder?: string;
  className?: string;
};

// 이미지 삽입은 업로드 중/실패 상태를 컴포넌트가 그려야 해서 핸들러를 주입받는다.
const createSlashCommandItems = (onInsertImage: (editor: Editor) => void): SlashCommandItem[] => [
  {
    title: "제목 1",
    description: "큰 제목",
    searchTerms: ["heading1", "h1", "제목1"],
    icon: <Heading1Icon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "제목 2",
    description: "중간 제목",
    searchTerms: ["heading2", "h2", "제목2"],
    icon: <Heading2Icon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "제목 3",
    description: "작은 제목",
    searchTerms: ["heading3", "h3", "제목3"],
    icon: <Heading3Icon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "불릿 리스트",
    description: "순서 없는 목록",
    searchTerms: ["bullet", "list", "ul", "불릿", "리스트"],
    icon: <ListBulletIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "숫자 리스트",
    description: "순서 있는 목록",
    searchTerms: ["numbered", "ordered", "ol", "숫자", "리스트"],
    icon: <ListOrderedIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "인용구",
    description: "인용 블록",
    searchTerms: ["quote", "blockquote", "인용"],
    icon: <QuoteIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "코드 블록",
    description: "코드를 표시합니다",
    searchTerms: ["code", "codeblock", "코드"],
    icon: <CodeIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "이미지",
    description: "이미지 삽입",
    searchTerms: ["image", "img", "이미지", "사진"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      // URL 입력이 아니라 파일을 첨부해 이미지를 삽입한다.
      editor.chain().focus().deleteRange(range).run();
      onInsertImage(editor);
    },
  },
];

// 파일 선택 창을 열어 고른 이미지 파일을 반환한다. 취소하면 null.
const pickImageFile = (): Promise<File | null> => {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(null);
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
};

const IMAGE_UPLOAD_FALLBACK_ERROR = "이미지를 올리지 못했어요. 잠시 후 다시 시도해주세요.";

type ImageUploadState = { status: "uploading" } | { status: "error"; message: string } | null;

type MenuState = {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
  clientRect: (() => DOMRect | null) | null;
  selectedIndex: number;
};

const getContainerClasses = (isEditable: boolean, className: string): string => {
  // 편집 모드에서만 입력 박스(테두리/배경)를 보여주고, 읽기 전용은 콘텐츠만 표시한다.
  const editableBoxClasses = "border border-[var(--border-default,#cccccc)] rounded-lg bg-white";
  return ["w-full", isEditable ? editableBoxClasses : "", className].filter(Boolean).join(" ");
};

const editorContentBaseClasses = [
  "w-full",
  "[&_.ProseMirror]:outline-none",
  "[&_.ProseMirror_h1]:text-[2rem] [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:leading-tight [&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h1]:mt-4",
  "[&_.ProseMirror_h2]:text-[1.5rem] [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:leading-snug [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:mt-4",
  "[&_.ProseMirror_h3]:text-[1.25rem] [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-3",
  "[&_.ProseMirror_p]:mb-2 [&_.ProseMirror_p]:leading-relaxed",
  "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:mb-2",
  "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:mb-2",
  "[&_.ProseMirror_li]:mb-1",
  "[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-[var(--color-primary-300,#85b5ee)] [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-[var(--text-secondary,#666666)] [&_.ProseMirror_blockquote]:my-3",
  "[&_.ProseMirror_pre]:bg-[var(--color-gray-900,#1a1a1a)] [&_.ProseMirror_pre]:text-[var(--color-gray-50,#f9f9f9)] [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:my-3 [&_.ProseMirror_pre]:overflow-x-auto",
  "[&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:text-inherit [&_.ProseMirror_pre_code]:p-0",
  "[&_.ProseMirror_code]:bg-[var(--color-gray-100,#f2f2f2)] [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-xs [&_.ProseMirror_code]:font-mono",
  "[&_.ProseMirror_a]:text-[var(--color-primary-700,#0e63cb)] [&_.ProseMirror_a]:underline",
  "[&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-md [&_.ProseMirror_img]:my-3",
  "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[var(--text-tertiary,#999999)]",
  "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
  "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
  "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
  "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
].join(" ");

// 편집 모드에서만 입력 영역 여백/최소 높이를 준다. 읽기 전용은 콘텐츠만 노출한다.
const getEditorContentClasses = (isEditable: boolean): string =>
  [editorContentBaseClasses, isEditable ? "min-h-[240px] px-4 py-3" : ""].filter(Boolean).join(" ");

export const RichEditor = ({
  content = "",
  onChange,
  isEditable = true,
  placeholder = "내용을 작성해주세요... (/ 를 입력하여 명령어 메뉴를 열 수 있습니다)",
  className = "",
}: RichEditorProps) => {
  const [menuState, setMenuState] = useState<MenuState | null>(null);
  const [imageUploadState, setImageUploadState] = useState<ImageUploadState>(null);
  const menuStateRef = useRef<MenuState | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const insertImage = useCallback(async (editor: Editor) => {
    const file = await pickImageFile();
    if (!file) return;

    setImageUploadState({ status: "uploading" });
    try {
      const url = await uploadEditorImage(file);
      // 업로드 중 화면을 떠나 에디터가 정리됐으면 삽입하지 않는다.
      if (editor.isDestroyed) return;
      editor.chain().focus().setImage({ src: url }).run();
      setImageUploadState(null);
    } catch (error) {
      console.error("Failed to upload editor image", error);
      setImageUploadState({
        status: "error",
        message:
          error instanceof EditorImageUploadError ? error.message : IMAGE_UPLOAD_FALLBACK_ERROR,
      });
    }
  }, []);

  // useEditor 설정은 첫 렌더에 고정되므로, 명령 목록도 한 번만 만든다.
  const [slashCommandItems] = useState(() =>
    createSlashCommandItems((editor) => void insertImage(editor)),
  );

  const updateMenu = useCallback((next: MenuState | null) => {
    menuStateRef.current = next;
    setMenuState(next);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Image,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      GlobalDragHandle,
      AutoJoiner,
      Placeholder.configure({ placeholder }),
      SlashCommand.configure({
        suggestion: {
          items: ({ query }: { query: string }) => filterSuggestionItems(slashCommandItems, query),
          render: () => ({
            onStart: ({
              items,
              command,
              clientRect,
            }: SuggestionProps<SlashCommandItem, SlashCommandItem>) =>
              updateMenu({
                items,
                command,
                clientRect: clientRect ?? null,
                selectedIndex: 0,
              }),
            onUpdate: ({
              items,
              command,
              clientRect,
            }: SuggestionProps<SlashCommandItem, SlashCommandItem>) =>
              updateMenu({
                items,
                command,
                clientRect: clientRect ?? null,
                selectedIndex: 0,
              }),
            onExit: () => updateMenu(null),
            onKeyDown: ({ event }: SuggestionKeyDownProps) => {
              const current = menuStateRef.current;
              if (!current) return false;
              const total = current.items.length;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                const nextIndex = total === 0 ? 0 : (current.selectedIndex + 1) % total;
                updateMenu({ ...current, selectedIndex: nextIndex });
                return true;
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                const nextIndex = total === 0 ? 0 : (current.selectedIndex - 1 + total) % total;
                updateMenu({ ...current, selectedIndex: nextIndex });
                return true;
              }
              if (event.key === "Enter") {
                const selected = current.items[current.selectedIndex];
                if (!selected) return false;
                event.preventDefault();
                current.command(selected);
                return true;
              }
              return false;
            },
          }),
        },
      }),
    ],
    content,
    editable: isEditable,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
      handleClick: (view, _pos, event) => {
        if (view.editable) return false;
        const target = event.target;
        if (!(target instanceof HTMLElement)) return false;
        const anchor = target.closest("a");
        const href = anchor?.getAttribute("href");
        if (!href || !/^https?:\/\//i.test(href)) return false;
        window.open(href, "_blank", "noopener,noreferrer");
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditable);
  }, [editor, isEditable]);

  return (
    <div className={getContainerClasses(isEditable, className)}>
      <EditorContent editor={editor} className={getEditorContentClasses(isEditable)} />
      {isEditable && imageUploadState?.status === "uploading" && (
        <div className="border-t border-[var(--border-default,#cccccc)] px-4 py-2">
          <Loading size="small" text="이미지를 올리는 중" />
        </div>
      )}
      {isEditable && imageUploadState?.status === "error" && (
        <p
          role="alert"
          className="border-t border-[var(--border-default,#cccccc)] px-4 py-2 text-[13px] text-[var(--color-error-500,#ef4444)]"
        >
          {imageUploadState.message}
        </p>
      )}
      {isEditable && menuState && (
        <SlashCommandMenu
          items={menuState.items}
          selectedIndex={menuState.selectedIndex}
          onSelect={menuState.command}
          clientRect={menuState.clientRect}
        />
      )}
    </div>
  );
};

/**
 * 리치 에디터 본문이 비었는지 판단한다.
 * 에디터는 내용을 모두 지워도 빈 문단 태그(`<p></p>`)를 돌려주므로,
 * 태그와 `&nbsp;`를 걷어낸 텍스트 기준으로 확인해야 한다.
 */
export const isRichTextEmpty = (html: string): boolean =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, "")
    .trim().length === 0;
