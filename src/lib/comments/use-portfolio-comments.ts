"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
  type CommentResponse,
  type CommentVisibility,
} from "@/api/comments";

export type CreateCommentInput = {
  content: string;
  visibility: CommentVisibility;
  parentCommentId?: number;
};

export type UpdateCommentInput = {
  content: string;
  visibility: CommentVisibility;
};

export type UsePortfolioCommentsResult = {
  comments: CommentResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  create: (input: CreateCommentInput) => Promise<boolean>;
  update: (commentId: number, input: UpdateCommentInput) => Promise<boolean>;
  remove: (commentId: number) => Promise<boolean>;
};

type CommentsFetchResult = {
  postId: number;
  comments?: CommentResponse[];
  error?: string;
};

const getErrorMessage = (cause: unknown): string => {
  if (cause instanceof Error && cause.message) return cause.message;
  return "댓글을 불러오지 못했습니다.";
};

// 댓글 조회 + 작성/수정/삭제. 변경 후에는 서버 상태를 재조회한다(mine/createdAt 등 서버 값 반영).
// 로딩 상태는 result 도착 여부로 파생한다(effect 내 동기 setState 회피 — 상세 페이지와 동일 패턴).
export const usePortfolioComments = (
  postId: number,
  enabled = true,
): UsePortfolioCommentsResult => {
  const [result, setResult] = useState<CommentsFetchResult | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const hasMatchingResult = result?.postId === postId;
  const isLoading = !enabled || !hasMatchingResult;
  const comments = hasMatchingResult ? (result.comments ?? []) : [];
  const error = hasMatchingResult ? (result.error ?? null) : null;

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    if (!enabled) return;

    let isCancelled = false;

    getComments(postId)
      .then((response) => {
        if (isCancelled) return;
        setResult({ postId, comments: response.content });
      })
      .catch((cause: unknown) => {
        if (isCancelled) return;
        setResult({ postId, error: getErrorMessage(cause) });
      });

    return () => {
      isCancelled = true;
    };
  }, [postId, enabled, reloadToken]);

  const create = useCallback(
    async (input: CreateCommentInput): Promise<boolean> => {
      try {
        await createComment({ postId, ...input });
        refetch();
        return true;
      } catch (cause) {
        console.error("댓글 작성에 실패했습니다.", cause);
        return false;
      }
    },
    [postId, refetch],
  );

  const update = useCallback(
    async (commentId: number, input: UpdateCommentInput): Promise<boolean> => {
      try {
        await updateComment(commentId, input);
        refetch();
        return true;
      } catch (cause) {
        console.error("댓글 수정에 실패했습니다.", cause);
        return false;
      }
    },
    [refetch],
  );

  const remove = useCallback(
    async (commentId: number): Promise<boolean> => {
      try {
        await deleteComment(commentId);
        refetch();
        return true;
      } catch (cause) {
        console.error("댓글 삭제에 실패했습니다.", cause);
        return false;
      }
    },
    [refetch],
  );

  return { comments, isLoading, error, refetch, create, update, remove };
};
