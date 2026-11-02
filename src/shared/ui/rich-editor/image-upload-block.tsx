import { ImageIcon } from "@/shared/ui/icons";
import { Spinner } from "@/shared/ui/spinner/spinner";

export type ImageUploadBlockProps = {
  status: "uploading" | "error";
  /** status가 error일 때 보여줄 문구 */
  message?: string | null;
  /** status가 error일 때 블록을 지우는 버튼 동작 */
  onRemove?: () => void;
};

const blockClasses =
  "my-3 flex w-full items-center gap-4 rounded-xl bg-[var(--color-gray-100,#f2f2f2)] px-4 py-3.5";

/** 본문 안에서 이미지 업로드 중/실패를 보여주는 블록 (아이콘 + 문구 한 줄). */
export const ImageUploadBlock = ({ status, message, onRemove }: ImageUploadBlockProps) => {
  if (status === "uploading") {
    return (
      <div className={blockClasses}>
        <ImageIcon size={22} className="shrink-0 text-[var(--color-gray-500,#808080)]" />
        <span role="status" className="flex-1 text-[15px] text-[var(--color-gray-500,#808080)]">
          이미지를 올리는 중
        </span>
        <Spinner size="small" className="shrink-0 text-[var(--color-gray-400,#999999)]" />
      </div>
    );
  }

  return (
    <div className={blockClasses}>
      <ImageIcon size={22} className="shrink-0 text-[var(--color-error-500,#ef4444)]" />
      <span role="alert" className="flex-1 text-[15px] text-[var(--color-error-500,#ef4444)]">
        {message}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded px-2 py-1 text-[13px] text-[var(--color-gray-500,#808080)] hover:bg-[var(--color-gray-200,#e5e5e5)]"
        >
          지우기
        </button>
      )}
    </div>
  );
};
