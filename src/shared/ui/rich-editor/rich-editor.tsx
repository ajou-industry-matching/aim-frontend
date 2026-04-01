import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export type RichEditorProps = {
  content?: string;
  onChange?: (html: string) => void;
  isEditable?: boolean;
  className?: string;
};

// Toolbar icon components
const BoldIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

const ItalicIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" x2="10" y1="4" y2="4" />
    <line x1="14" x2="5" y1="20" y2="20" />
    <line x1="15" x2="9" y1="4" y2="20" />
  </svg>
);

const BulletListIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="9" x2="21" y1="6" y2="6" />
    <line x1="9" x2="21" y1="12" y2="12" />
    <line x1="9" x2="21" y1="18" y2="18" />
    <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const OrderedListIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="10" x2="21" y1="6" y2="6" />
    <line x1="10" x2="21" y1="12" y2="12" />
    <line x1="10" x2="21" y1="18" y2="18" />
    <path d="M4 6h1v4" />
    <path d="M4 10h2" />
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </svg>
);

const BlockquoteIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

const CodeBlockIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// Class helpers
const getToolbarButtonClasses = (isActive: boolean): string => {
  const baseClasses =
    "inline-flex items-center justify-center w-8 h-8 rounded text-sm font-medium transition-colors cursor-pointer";
  const activeClasses = "bg-[var(--color-primary-800,#004a9c)] text-white";
  const defaultClasses =
    "text-[var(--color-gray-700,#4d4d4d)] hover:bg-[var(--color-gray-100,#f2f2f2)]";
  return [baseClasses, isActive ? activeClasses : defaultClasses].join(" ");
};

const getContainerClasses = (className: string): string => {
  const baseClasses =
    "w-full border border-[var(--border-default,#cccccc)] rounded-lg bg-white overflow-hidden";
  return [baseClasses, className].filter(Boolean).join(" ");
};

const editorContentClasses = [
  "w-full min-h-[240px] px-4 py-3",
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
].join(" ");

// Sub-components
type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  "aria-label": string;
  children: React.ReactNode;
};

const ToolbarButton = ({
  onClick,
  isActive = false,
  "aria-label": ariaLabel,
  children,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    aria-pressed={isActive}
    className={getToolbarButtonClasses(isActive)}
  >
    {children}
  </button>
);

const ToolbarDivider = () => (
  <div className="w-px h-5 bg-[var(--border-default,#cccccc)] mx-0.5" aria-hidden="true" />
);

// Main component
export const RichEditor = React.forwardRef<HTMLDivElement, RichEditorProps>(
  ({ content = "", onChange, isEditable = true, className = "" }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
      ],
      content,
      editable: isEditable,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
    });

    useEffect(() => {
      if (!editor) return;
      editor.setEditable(isEditable);
    }, [editor, isEditable]);

    return (
      <div ref={ref} className={getContainerClasses(className)}>
        {isEditable && (
          <div
            className="flex items-center flex-wrap gap-0.5 px-3 py-2 border-b border-[var(--border-subtle,#e5e5e5)] bg-[var(--color-gray-50,#f9f9f9)]"
            role="toolbar"
            aria-label="텍스트 서식 도구"
          >
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor?.isActive("heading", { level: 1 }) ?? false}
              aria-label="제목 1"
            >
              <span className="text-xs font-bold">H1</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor?.isActive("heading", { level: 2 }) ?? false}
              aria-label="제목 2"
            >
              <span className="text-xs font-bold">H2</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor?.isActive("heading", { level: 3 }) ?? false}
              aria-label="제목 3"
            >
              <span className="text-xs font-bold">H3</span>
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              isActive={editor?.isActive("bold") ?? false}
              aria-label="굵게"
            >
              <BoldIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              isActive={editor?.isActive("italic") ?? false}
              aria-label="기울임꼴"
            >
              <ItalicIcon />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              isActive={editor?.isActive("bulletList") ?? false}
              aria-label="불릿 리스트"
            >
              <BulletListIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              isActive={editor?.isActive("orderedList") ?? false}
              aria-label="숫자 리스트"
            >
              <OrderedListIcon />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              isActive={editor?.isActive("blockquote") ?? false}
              aria-label="인용구"
            >
              <BlockquoteIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              isActive={editor?.isActive("codeBlock") ?? false}
              aria-label="코드 블록"
            >
              <CodeBlockIcon />
            </ToolbarButton>
          </div>
        )}
        <EditorContent editor={editor} className={editorContentClasses} />
      </div>
    );
  },
);

RichEditor.displayName = "RichEditor";
