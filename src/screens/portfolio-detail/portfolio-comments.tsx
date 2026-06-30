"use client";

import { useState } from "react";
import { Avatar } from "@/shared/ui/avatars/avatars";
import { Button } from "@/shared/ui/button/button";
import { Textarea } from "@/shared/ui/input/input";
import { CornerDownRightIcon, LockIcon, SendIcon } from "@/shared/ui/icons";

// ⚠️ 백엔드 댓글 API 미구현 상태. 현재는 목업 데이터 + 로컬 상태로 UI만 구성한다.
// 추후 src/api/comments + 훅으로 교체 예정 (docs/2026-06-23-portfolio-comments-todo.md 참고).

export type PortfolioCommentsProps = {
  postId: number;
};

type CommentVisibility = "PUBLIC" | "PRIVATE";

type CommentAuthor = {
  name: string;
  department: string;
  profileImageUrl?: string;
};

type PortfolioComment = {
  commentId: number;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  visibility: CommentVisibility;
  // 본인이 작성한 댓글인지 (수정/삭제 노출용)
  isMine: boolean;
  // 비공개 댓글을 볼 수 있는지 (작성자 또는 글 주인). false면 내용 마스킹
  canView: boolean;
  replies: PortfolioComment[];
};

// 로그인 연동 전까지 사용하는 임시 현재 사용자
const currentUser: CommentAuthor = {
  name: "현재 사용자",
  department: "소프트웨어학과",
};

// figma design 3가지 케이스를 모두 담은 목업 데이터
const mockComments: PortfolioComment[] = [
  {
    commentId: 1,
    author: { name: "이영희", department: "미디어학과" },
    content: "정말 인상적인 프로젝트네요! 추천 알고리즘 부분이 특히 흥미롭습니다.",
    createdAt: "2024-01-18",
    visibility: "PUBLIC",
    isMine: false,
    canView: true,
    replies: [
      {
        commentId: 11,
        author: { name: "김철수", department: "소프트웨어학과" },
        content: "저도 동의합니다! 특히 데이터 처리 방식이 효율적이네요.",
        createdAt: "2024-01-18",
        visibility: "PUBLIC",
        isMine: false,
        canView: true,
        replies: [],
      },
    ],
  },
  {
    commentId: 2,
    author: { name: "김철수", department: "디자인학과" },
    content: "비공개 피드백: 코드 리뷰 관련해서 따로 연락드릴게요.",
    createdAt: "2024-01-20",
    visibility: "PRIVATE",
    isMine: false,
    canView: true,
    replies: [
      {
        commentId: 21,
        author: currentUser,
        content: "네, 감사합니다! 슬랙으로 연락주세요.",
        createdAt: "2024-01-20",
        visibility: "PRIVATE",
        isMine: true,
        canView: true,
        replies: [],
      },
    ],
  },
  {
    commentId: 3,
    author: { name: "박민수", department: "소프트웨어학과" },
    content: "타인에게는 보이지 않는 비공개 댓글입니다.",
    createdAt: "2024-01-21",
    visibility: "PRIVATE",
    isMine: false,
    canView: false,
    replies: [],
  },
];

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

// 댓글 + 답글 전체 개수
const countComments = (comments: PortfolioComment[]): number =>
  comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0);

const generateId = (): number => Date.now();

// 최상위/답글 모두 순회하며 content 갱신
const mapUpdateContent = (
  comments: PortfolioComment[],
  targetId: number,
  content: string,
): PortfolioComment[] =>
  comments.map((comment) => {
    if (comment.commentId === targetId) return { ...comment, content };
    if (comment.replies.length > 0) {
      return { ...comment, replies: mapUpdateContent(comment.replies, targetId, content) };
    }
    return comment;
  });

// 최상위/답글 모두 순회하며 삭제
const filterRemove = (comments: PortfolioComment[], targetId: number): PortfolioComment[] =>
  comments
    .filter((comment) => comment.commentId !== targetId)
    .map((comment) => ({ ...comment, replies: filterRemove(comment.replies, targetId) }));

// ----------------------------------------------------------------------
// 컴포넌트
// ----------------------------------------------------------------------

export const PortfolioComments = ({ postId }: PortfolioCommentsProps) => {
  void postId; // API 연동 시 사용 예정

  const [comments, setComments] = useState<PortfolioComment[]>(mockComments);
  const [newContent, setNewContent] = useState("");
  const [newVisibility, setNewVisibility] = useState<CommentVisibility>("PUBLIC");

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const totalComments = countComments(comments);

  const handleCreate = () => {
    const content = newContent.trim();
    if (!content) return;

    const comment: PortfolioComment = {
      commentId: generateId(),
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      visibility: newVisibility,
      isMine: true,
      canView: true,
      replies: [],
    };

    setComments((prev) => [comment, ...prev]);
    setNewContent("");
    setNewVisibility("PUBLIC");
  };

  const handleReplySubmit = (parent: PortfolioComment) => {
    const content = replyContent.trim();
    if (!content) return;

    const reply: PortfolioComment = {
      commentId: generateId(),
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      // ⭐ 답글의 공개/비공개는 부모 댓글을 따른다
      visibility: parent.visibility,
      isMine: true,
      canView: true,
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.commentId === parent.commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment,
      ),
    );
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleEditStart = (comment: PortfolioComment) => {
    setEditingId(comment.commentId);
    setEditContent(comment.content);
    setReplyingTo(null);
  };

  const handleEditSave = (targetId: number) => {
    const content = editContent.trim();
    if (!content) return;
    setComments((prev) => mapUpdateContent(prev, targetId, content));
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (targetId: number) => {
    if (typeof window !== "undefined" && !window.confirm("댓글을 삭제할까요?")) return;
    setComments((prev) => filterRemove(prev, targetId));
  };

  const renderComment = (comment: PortfolioComment, isReply: boolean) => {
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
          <span className={nameClasses}>{comment.author.name}</span>
          <span className={metaClasses}>{comment.author.department}</span>
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
              <Button variant="ghost" size="small" onClick={() => setEditingId(null)}>
                취소
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => handleEditSave(comment.commentId)}
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
            {!isReply && (
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
            {comment.isMine && (
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

  const renderReplyForm = (parent: PortfolioComment) => {
    const isPrivate = parent.visibility === "PRIVATE";
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
            <div className="flex items-center justify-between">
              {/* ⭐ 답글은 부모 댓글의 공개/비공개를 따른다 (토글 없음, 상태 표시만) */}
              <div className="flex items-center gap-2">
                <span className={`${getVisibilityToggleClasses(isPrivate)} cursor-default`}>
                  <LockIcon size={12} />
                  {isPrivate ? "비공개" : "공개"}
                </span>
                <span className="text-[11px] text-[var(--color-gray-400,#999999)]">
                  부모 댓글 설정을 따릅니다
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="small"
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

  return (
    <div className="flex flex-col gap-5">
      <h2 className={sectionTitleClasses}>댓글 {totalComments > 0 ? totalComments : ""}</h2>

      {/* 댓글 작성 폼 (공개/비공개 토글 포함) */}
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
            onClick={() => setNewVisibility((prev) => (prev === "PRIVATE" ? "PUBLIC" : "PRIVATE"))}
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
            disabled={!newContent.trim()}
          >
            댓글 등록
          </Button>
        </div>
      </form>

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-gray-300,#cccccc)] p-8 text-center text-[14px] text-[var(--color-gray-500,#808080)]">
          첫 댓글을 남겨보세요.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => {
            const isMasked = comment.visibility === "PRIVATE" && !comment.canView;

            // 비공개 + 열람 불가 → 내용 마스킹 (figma Case 3)
            if (isMasked) {
              return (
                <div key={comment.commentId} className={cardClasses}>
                  <div className="flex items-center gap-2 p-4 text-[14px] text-[var(--color-gray-400,#999999)]">
                    <LockIcon size={16} />
                    <span>비공개 댓글입니다.</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={comment.commentId} className={cardClasses}>
                {/* 최상위 댓글 */}
                <div className="flex gap-3 p-4">
                  <Avatar
                    name={comment.author.name}
                    src={comment.author.profileImageUrl}
                    size="md"
                  />
                  {renderComment(comment, false)}
                </div>

                {/* 답글 목록 (카드 내부) */}
                {comment.replies.map((reply) => {
                  const isReplyMasked = reply.visibility === "PRIVATE" && !reply.canView;
                  if (isReplyMasked) {
                    return (
                      <div
                        key={reply.commentId}
                        className="ml-6 flex items-center gap-2 px-4 py-3 text-[13px] text-[var(--color-gray-400,#999999)]"
                      >
                        <LockIcon size={14} />
                        <span>비공개 댓글입니다.</span>
                      </div>
                    );
                  }
                  return (
                    <div key={reply.commentId} className="ml-6 flex gap-3 px-4 py-3">
                      <CornerDownRightIcon
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-[var(--color-gray-300,#cccccc)]"
                      />
                      <Avatar
                        name={reply.author.name}
                        src={reply.author.profileImageUrl}
                        size="sm"
                      />
                      {renderComment(reply, true)}
                    </div>
                  );
                })}

                {/* 답글 작성 폼 (카드 내부, 토글 없음) */}
                {replyingTo === comment.commentId && renderReplyForm(comment)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
