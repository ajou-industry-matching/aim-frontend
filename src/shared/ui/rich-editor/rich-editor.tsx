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

import { EDITOR_IMAGE_TYPES, ImageUploadUserError } from "@/shared/config/editor-image";

import { SlashCommand, filterSuggestionItems, type SlashCommandItem } from "./slash-command";
import { SlashCommandMenu } from "./slash-command-menu";
import {
  IMAGE_UPLOAD_HTML_PATTERN,
  IMAGE_UPLOAD_NODE_NAME,
  ImageUploadNode,
  getImageUploader,
  setImageUploader,
} from "./image-upload-node";

export type RichEditorProps = {
  content?: string;
  onChange?: (html: string) => void;
  isEditable?: boolean;
  placeholder?: string;
  className?: string;
  /** 넘기면 슬래시 명령에 "이미지"가 생긴다. 고른 파일을 업로드하고 이미지 URL을 돌려줘야 한다. */
  onUploadImage?: (file: File) => Promise<string>;
  /** 본문에 업로드 중인 이미지가 있는지 알려준다. 업로드 중 저장을 막는 데 쓴다. */
  onUploadingChange?: (isUploading: boolean) => void;
  /** 붙여넣거나 끌어온 이미지를 받을지. false인 이미지는 빼고 안내 문구를 보여준다. */
  canPasteImage?: (src: string) => boolean;
};

const baseSlashCommandItems: SlashCommandItem[] = [
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
];

// 이미지 삽입은 업로드를 맡길 곳이 있을 때만 메뉴에 넣는다.
const createSlashCommandItems = (
  onInsertImage: ((editor: Editor) => void) | null,
): SlashCommandItem[] =>
  onInsertImage
    ? [
        ...baseSlashCommandItems,
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
      ]
    : baseSlashCommandItems;

// 파일 선택 창을 열어 고른 이미지 파일을 반환한다. 취소하면 null.
const pickImageFile = (): Promise<File | null> => {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(null);
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = EDITOR_IMAGE_TYPES.join(",");
    input.onchange = () => resolve(input.files?.[0] ?? null);
    // 선택 창을 취소하면 change가 오지 않으므로 cancel에서도 끝낸다.
    input.addEventListener("cancel", () => resolve(null));
    input.click();
  });
};

const IMAGE_UPLOAD_FALLBACK_ERROR = "이미지를 올리지 못했어요. 잠시 후 다시 시도해주세요.";

const createUploadId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// 업로드 중 사용자가 글을 고쳐도 자리표시 블록은 id로 다시 찾는다. 이미 지웠으면 null.
type UploadNodeMatch = { pos: number; nodeSize: number; attrs: Record<string, unknown> };

const findUploadNode = (editor: Editor, uploadId: string): UploadNodeMatch | null => {
  let found: UploadNodeMatch | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (found) return false;
    if (node.type.name === IMAGE_UPLOAD_NODE_NAME && node.attrs.uploadId === uploadId) {
      found = { pos, nodeSize: node.nodeSize, attrs: node.attrs };
      return false;
    }
    return true;
  });
  // descendants 콜백 안 할당을 TS가 추적하지 못해 never로 좁히므로 다시 넓힌다.
  return found as UploadNodeMatch | null;
};

const hasUploadingImage = (editor: Editor): boolean => {
  let isUploading = false;
  editor.state.doc.descendants((node) => {
    if (isUploading) return false;
    if (node.type.name === IMAGE_UPLOAD_NODE_NAME && node.attrs.status === "uploading") {
      isUploading = true;
    }
    return !isUploading;
  });
  return isUploading;
};

const insertImage = async (editor: Editor): Promise<void> => {
  const upload = getImageUploader(editor);
  if (!upload) return;
  const file = await pickImageFile();
  if (!file || editor.isDestroyed) return;

  // 고른 자리에 업로드 블록을 먼저 넣고, 끝나면 그 블록을 이미지로 바꾼다.
  const uploadId = createUploadId();
  editor.chain().focus().insertContent({ type: IMAGE_UPLOAD_NODE_NAME, attrs: { uploadId } }).run();

  try {
    const url = await upload(file);
    // 업로드 중 화면을 떠났거나 블록을 지웠으면 삽입하지 않는다. 남은 파일 정리는 업로드를 맡긴 쪽이 한다.
    if (editor.isDestroyed) return;
    const target = findUploadNode(editor, uploadId);
    if (!target) return;
    // focus 없이 바꿔서 그사이 다른 곳에 있던 커서를 끌고 오지 않는다.
    // 되돌리기 기록에서 빼야 Ctrl+Z가 "업로드 중" 블록을 되살리지 않고 삽입 자체를 취소한다.
    editor.view.dispatch(
      editor.state.tr
        .replaceWith(
          target.pos,
          target.pos + target.nodeSize,
          editor.schema.nodes.image.create({ src: url }),
        )
        .setMeta("addToHistory", false),
    );
  } catch (error) {
    console.error("Failed to upload editor image", error);
    if (editor.isDestroyed) return;
    const target = findUploadNode(editor, uploadId);
    if (!target) return;
    editor.view.dispatch(
      editor.state.tr
        .setNodeMarkup(target.pos, undefined, {
          ...target.attrs,
          status: "error",
          message:
            error instanceof ImageUploadUserError ? error.message : IMAGE_UPLOAD_FALLBACK_ERROR,
        })
        .setMeta("addToHistory", false),
    );
  }
};

const BLOCKED_PASTE_NOTICE =
  "다른 글의 이미지는 붙여넣을 수 없어요. / 메뉴로 이미지를 다시 올려주세요.";
const BLOCKED_PASTE_NOTICE_MS = 4000;

// 붙여넣기 HTML에서 받을 수 없는 이미지를 걷어내고, 걷어낸 개수를 함께 돌려준다.
const filterPastedImages = (
  html: string,
  canPasteImage: (src: string) => boolean,
): { html: string; removedCount: number } => {
  if (typeof DOMParser === "undefined") return { html, removedCount: 0 };
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocked = Array.from(doc.querySelectorAll("img")).filter(
    (img) => !canPasteImage(img.getAttribute("src") ?? ""),
  );
  if (blocked.length === 0) return { html, removedCount: 0 };
  blocked.forEach((img) => img.remove());
  return { html: doc.body.innerHTML, removedCount: blocked.length };
};

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
  onUploadImage,
  onUploadingChange,
  canPasteImage,
}: RichEditorProps) => {
  const [menuState, setMenuState] = useState<MenuState | null>(null);
  const [isPasteBlocked, setIsPasteBlocked] = useState(false);
  const canPasteImageRef = useRef(canPasteImage);
  const menuStateRef = useRef<MenuState | null>(null);
  const onChangeRef = useRef(onChange);
  const onUploadingChangeRef = useRef(onUploadingChange);
  const isUploadingRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
    onUploadingChangeRef.current = onUploadingChange;
    canPasteImageRef.current = canPasteImage;
  }, [onChange, onUploadingChange, canPasteImage]);

  useEffect(() => {
    if (!isPasteBlocked) return;
    const timer = window.setTimeout(() => setIsPasteBlocked(false), BLOCKED_PASTE_NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [isPasteBlocked]);

  // useEditor 설정은 첫 렌더에 고정되므로, 명령 목록도 한 번만 만든다.
  const [slashCommandItems] = useState(() =>
    createSlashCommandItems(onUploadImage ? (editor) => void insertImage(editor) : null),
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
      ImageUploadNode,
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
      // 붙여넣기와 끌어다 놓기 모두 이 단계를 지난다.
      transformPastedHTML: (html) => {
        const canPaste = canPasteImageRef.current;
        if (!canPaste) return html;
        const result = filterPastedImages(html, canPaste);
        if (result.removedCount > 0) setIsPasteBlocked(true);
        return result.html;
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
      // 업로드 자리표시 블록은 저장되는 본문에 남기지 않는다.
      onChangeRef.current?.(editor.getHTML().replace(IMAGE_UPLOAD_HTML_PATTERN, ""));

      const isUploading = hasUploadingImage(editor);
      if (isUploading !== isUploadingRef.current) {
        isUploadingRef.current = isUploading;
        onUploadingChangeRef.current?.(isUploading);
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditable);
  }, [editor, isEditable]);

  useEffect(() => {
    if (!editor) return;
    setImageUploader(editor, onUploadImage ?? null);
  }, [editor, onUploadImage]);

  return (
    <div className={getContainerClasses(isEditable, className)}>
      <EditorContent editor={editor} className={getEditorContentClasses(isEditable)} />
      {isEditable && isPasteBlocked && (
        <p
          role="status"
          className="border-t border-[var(--border-default,#cccccc)] px-4 py-2 text-[13px] text-[var(--color-gray-500,#808080)]"
        >
          {BLOCKED_PASTE_NOTICE}
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
