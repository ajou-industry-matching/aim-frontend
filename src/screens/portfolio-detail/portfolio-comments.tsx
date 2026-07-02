"use client";

import { useState } from "react";
import type { CommentResponse, CommentVisibility } from "@/api/comments";
import { useAuthReady } from "@/lib/auth";
import { usePortfolioComments } from "@/lib/comments";
import { Avatar } from "@/shared/ui/avatars/avatars";
import { Button } from "@/shared/ui/button/button";
import { Textarea } from "@/shared/ui/input/input";
import { Spinner } from "@/shared/ui/spinner/spinner";
import { CornerDownRightIcon, LockIcon, SendIcon } from "@/shared/ui/icons";

export type PortfolioCommentsProps = {
  postId: number;
};

// ----------------------------------------------------------------------
// 스타일 토큰
// ----------------------------------------------------------------------

const sectionTitleClasses =
  "text-[24px] font-semibold leading-[1.33] tracking-[-0.6px] text-[var(--color-gray-900,#1a1a1a)]";

const cardClasses = "rounded-lg border border-[var(--color-gray-200,#e5e5e5)]";

const visibilityToggleBaseClasses =
  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors";

const privateBadgeClasses =
  "inline-flex items-center gap-1 rounded-full bg-[rgba(0,74,156,0.1)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary-800,#004a9c)]";

const replyWriteButtonClasses =
  "text-[12px] text-[var(--color-gray-400,#999999)] transition-colors hover:text-[var(--color-primary-800,#004a9c)]";

const editButtonClasses =
  "text-[12px] text-[var(--color-gray-400,#999999)] transition-colors hover:text-[var(--color-primary-800,#004a9c)]";

const deleteButtonClasses =
  "text-[12px] text-[var(--color-gray-400,#999999)] transition-colors hover:text-[var(--color-error-500,#ef4444)]";

const mutedRowClasses = "text-[14px] text-[var(--color-gray-400,#999999)]";

const getVisibilityToggleClasses = (isPrivate: boolean): string =>
  [
    visibilityToggleBaseClasses,
    isPrivate
      ? "border-[var(--color-primary-800,#004a9c)] bg-[rgba(0,74,156,0.1)] text-[var(--color-primary-800,#004a9c)]"
      : "border-[var(--color-gray-200,#e5e5e5)] bg-[var(--color-gray-100,#f2f2f2)] text-[var(--color-gray-400,#999999)]",
  ].join(" ");

// ----------------------------------------------------------------------
// 헬퍼
// ----------------------------------------------------------------------

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR");
};

// 댓글 + 답글 전체 개수 (삭제된 것 제외)
const countComments = (comments: CommentResponse[]): number =>
  comments.reduce(
    (total, comment) => total + (comment.deleted ? 0 : 1) + countComments(comment.children),
    0,
  );

// ----------------------------------------------------------------------
// 컴포넌트
// ----------------------------------------------------------------------

export const PortfolioComments = ({ postId }: PortfolioCommentsProps) => {
  const { isReady: isAuthReady, isAuthenticated } = useAuthReady();
  const { comments, isLoading, error, create, update, remove } = usePortfolioComments(
    postId,
    isAuthReady,
  );

  const [newContent, setNewContent] = useState("");
  const [newVisibility, setNewVisibility] = useState<CommentVisibility>("PUBLIC");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalComments = countComments(comments);

  const handleCreate = async () => {
    const content = newContent.trim();
    if (!content || isSubmitting) return;
    setIsSubmitting(true);
    const isSuccess = await create({ content, visibility: newVisibility });
    setIsSubmitting(false);
    if (!isSuccess) {
      window.alert("댓글 등록에 실패했습니다.");
      return;
    }
    setNewContent("");
    setNewVisibility("PUBLIC");
  };

  const handleReplySubmit = async (parent: CommentResponse) => {
    const content = replyContent.trim();
    if (!content || isSubmitting) return;
    setIsSubmitting(true);
    // ⭐ 답글의 공개/비공개는 부모 댓글을 따른다
    const isSuccess = await create({
      content,
      visibility: parent.visibility,
      parentCommentId: parent.commentId,
    });
    setIsSubmitting(false);
    if (!isSuccess) {
      window.alert("답글 등록에 실패했습니다.");
      return;
    }
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleEditStart = (comment: CommentResponse) => {
    setEditingId(comment.commentId);
    setEditContent(comment.content);
    setReplyingTo(null);
  };

  const handleEditSave = async (comment: CommentResponse) => {
    const content = editContent.trim();
    if (!content || isSubmitting) return;
    setIsSubmitting(true);
    // 수정 시 공개/비공개는 기존 값을 유지한다
    const isSuccess = await update(comment.commentId, { content, visibility: comment.visibility });
    setIsSubmitting(false);
    if (!isSuccess) {
      window.alert("댓글 수정에 실패했습니다.");
      return;
    }
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = async (commentId: number) => {
    if (typeof window !== "undefined" && !window.confirm("댓글을 삭제할까요?")) return;
    const isSuccess = await remove(commentId);
    if (!isSuccess) window.alert("댓글 삭제에 실패했습니다.");
  };

  const renderComment = (comment: CommentResponse, isReply: boolean) => {
    const isEditing = editingId === comment.commentId;
    const isPrivate = comment.visibility === "PRIVATE";

    const nameClasses = isReply
      ? "font-semibold text-[13px] text-[var(--color-gray-800,#333333)]"
      : "font-semibold text-[14px] text-[var(--color-gray-800,#333333)]";
    const metaClasses = isReply
      ? "text-[11px] text-[var(--color-gray-400,#999999)]"
      : "text-[12px] text-[var(--color-gray-400,#999999)]";
    const bodyClasses = isReply
      ? "text-[13px] leading-[1.5] tracking-[-0.35px] text-[var(--color-gray-600,#666666)]"
      : "text-[14px] leading-[1.5] tracking-[-0.35px] text-[var(--color-gray-600,#666666)]";

    return (
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={nameClasses}>{comment.authorName}</span>
          <span className={metaClasses}>{comment.department}</span>
          <span className={metaClasses}>· {formatDate(comment.createdAt)}</span>
          {isPrivate && (
            <span className={privateBadgeClasses}>
              <LockIcon size={12} />
              비공개
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2 pt-1">
            <Textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              rows={2}
              className="resize-none text-[14px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="small"
                disabled={isSubmitting}
                onClick={() => setEditingId(null)}
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="small"
                disabled={isSubmitting}
                onClick={() => handleEditSave(comment)}
              >
                저장
              </Button>
            </div>
          </div>
        ) : (
          <p className={bodyClasses}>{comment.content}</p>
        )}

        {!isEditing && (
          <div className="mt-1 flex items-center gap-3">
            {!isReply && isAuthenticated && (
              <button
                type="button"
                className={replyWriteButtonClasses}
                onClick={() =>
                  setReplyingTo((prev) => (prev === comment.commentId ? null : comment.commentId))
                }
              >
                답글쓰기
              </button>
            )}
            {comment.mine && (
              <>
                <button
                  type="button"
                  className={editButtonClasses}
                  onClick={() => handleEditStart(comment)}
                >
                  수정
                </button>
                <button
                  type="button"
                  className={deleteButtonClasses}
                  onClick={() => handleDelete(comment.commentId)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderReplyForm = (parent: CommentResponse) => {
    return (
      <div className="rounded-b-lg px-4 py-3">
        <div className="ml-6 flex gap-3">
          <CornerDownRightIcon
            size={16}
            className="mt-2.5 flex-shrink-0 text-[var(--color-gray-300,#cccccc)]"
          />
          <div className="flex flex-1 flex-col gap-2">
            <Textarea
              value={replyContent}
              onChange={(event) => setReplyContent(event.target.value)}
              placeholder="답글을 입력해 주세요..."
              rows={2}
              className="resize-none text-[14px]"
            />
            {/* 답글의 공개/비공개는 부모 댓글을 따른다 (handleReplySubmit에서 처리) */}
            <div className="flex items-center justify-end">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="small"
                  disabled={isSubmitting}
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  iconPosition="left"
                  icon={<SendIcon size={14} />}
                  disabled={isSubmitting}
                  onClick={() => handleReplySubmit(parent)}
                >
                  답글 등록
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12" role="status" aria-label="댓글 불러오는 중">
          <Spinner size="medium" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-lg border border-dashed border-[var(--color-gray-300,#cccccc)] p-8 text-center text-[14px] text-[var(--color-error-500,#ef4444)]">
          {error}
        </div>
      );
    }

    if (comments.length === 0) {
      return (
        <div className="rounded-lg border border-dashed border-[var(--color-gray-300,#cccccc)] p-8 text-center text-[14px] text-[var(--color-gray-500,#808080)]">
          첫 댓글을 남겨보세요.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div key={comment.commentId} className={cardClasses}>
            {/* 최상위 댓글 */}
            {comment.deleted ? (
              <div className={`p-4 ${mutedRowClasses}`}>삭제된 댓글입니다.</div>
            ) : (
              <div className="flex gap-3 p-4">
                <Avatar
                  name={comment.authorName}
                  src={comment.profileImageUrl || undefined}
                  size="md"
                />
                {renderComment(comment, false)}
              </div>
            )}

            {/* 답글 목록 (카드 내부) */}
            {comment.children.map((reply) =>
              reply.deleted ? (
                <div
                  key={reply.commentId}
                  className={`ml-6 px-4 py-3 text-[13px] ${mutedRowClasses}`}
                >
                  삭제된 댓글입니다.
                </div>
              ) : (
                <div key={reply.commentId} className="ml-6 flex gap-3 px-4 py-3">
                  <CornerDownRightIcon
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-[var(--color-gray-300,#cccccc)]"
                  />
                  <Avatar
                    name={reply.authorName}
                    src={reply.profileImageUrl || undefined}
                    size="sm"
                  />
                  {renderComment(reply, true)}
                </div>
              ),
            )}

            {/* 답글 작성 폼 (카드 내부, 토글 없음) */}
            {replyingTo === comment.commentId && renderReplyForm(comment)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className={sectionTitleClasses}>댓글 {totalComments > 0 ? totalComments : ""}</h2>

      {/* 작성 폼 (로그인 필요) */}
      {isAuthReady &&
        (isAuthenticated ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleCreate();
            }}
          >
            <Textarea
              value={newContent}
              onChange={(event) => setNewContent(event.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                className={getVisibilityToggleClasses(newVisibility === "PRIVATE")}
                onClick={() =>
                  setNewVisibility((prev) => (prev === "PRIVATE" ? "PUBLIC" : "PRIVATE"))
                }
              >
                <LockIcon size={12} />
                {newVisibility === "PRIVATE" ? "비공개" : "공개"}
              </button>
              <Button
                type="submit"
                variant="primary"
                size="medium"
                iconPosition="left"
                icon={<SendIcon size={16} />}
                disabled={!newContent.trim() || isSubmitting}
              >
                댓글 등록
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-lg border border-[var(--color-gray-200,#e5e5e5)] p-6 text-center">
            <p className="text-[14px] text-[var(--color-gray-600,#666666)]">
              로그인 후 댓글을 작성할 수 있어요.
            </p>
          </div>
        ))}

      {/* 댓글 목록 */}
      {renderList()}
    </div>
  );
};
