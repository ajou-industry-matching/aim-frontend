import { backendJson } from "@/api/client";

export type CommentVisibility = "PUBLIC" | "PRIVATE";

// GET /api/comments/{postId} 의 목록 아이템 (답글은 children으로 중첩)
export type CommentResponse = {
  commentId: number;
  parentCommentId: number | null;
  userId: number;
  authorName: string;
  department: string;
  profileImageUrl: string | null;
  content: string;
  createdAt: string;
  mine: boolean;
  visibility: CommentVisibility;
  children: CommentResponse[];
  deleted: boolean;
};

export type CommentPageResponse = {
  content: CommentResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CommentCreateRequest = {
  postId: number;
  content: string;
  parentCommentId?: number;
  visibility?: CommentVisibility;
};

export type CommentUpdateRequest = {
  content: string;
  visibility: CommentVisibility;
};

// 작성/수정 응답 (단일 댓글)
export type CommentCommandResponse = {
  commentId: number;
  postId: number;
  parentCommentId: number | null;
  userId: number;
  authorName: string;
  department: string;
  profileImageUrl: string | null;
  content: string;
  createdAt: string;
  mine: boolean;
  visibility: CommentVisibility;
  commentCount: number;
  deleted: boolean;
};

export type CommentPageableParams = {
  page?: number;
  size?: number;
  // Spring Pageable 형식: "createdAt,desc"
  sort?: string;
};

const COMMENT_DEFAULT_PAGE_SIZE = 50;
const COMMENT_DEFAULT_SORT = "createdAt,desc";

const buildCommentPageableParams = ({
  page = 0,
  size = COMMENT_DEFAULT_PAGE_SIZE,
  sort = COMMENT_DEFAULT_SORT,
}: CommentPageableParams): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sort", sort);
  return params;
};

export const getComments = async (
  postId: number,
  pageable: CommentPageableParams = {},
): Promise<CommentPageResponse> => {
  const params = buildCommentPageableParams(pageable);
  // 공개 조회: 비로그인도 접근 가능 (로그인 시 본인 비공개 댓글 + mine 플래그 포함)
  return backendJson<CommentPageResponse>(`/api/comments/${postId}?${params.toString()}`, {
    requiresAuth: false,
  });
};

export const createComment = async (
  request: CommentCreateRequest,
): Promise<CommentCommandResponse> => {
  return backendJson<CommentCommandResponse, CommentCreateRequest>(`/api/comments`, {
    method: "POST",
    json: request,
  });
};

export const updateComment = async (
  commentId: number,
  request: CommentUpdateRequest,
): Promise<CommentCommandResponse> => {
  return backendJson<CommentCommandResponse, CommentUpdateRequest>(`/api/comments/${commentId}`, {
    method: "PUT",
    json: request,
  });
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await backendJson<void>(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
};
