import { backendJson } from "@/api/client";

export type BoardType =
  | "PORTFOLIO"
  | "LAB_INTERN"
  | "COMPANY_PROJECT"
  | "CRAWLED_PROJECT"
  | "NOTICE";

export type PostSortType = "LATEST" | "POPULAR" | "VIEWS";

export type Post = {
  postId: number;
  userId: number;
  boardType: BoardType;
  title: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  thumbnailImage?: string;
  liked?: boolean | null;
  keywords: string[];
};

export type PostListResponse = {
  content: Post[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type GetPostsParams = {
  page?: number;
  size?: number;
  sort?: PostSortType;
  keyword?: string;
};

export const getPosts = (boardType: BoardType, params?: GetPostsParams) => {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.size !== undefined) searchParams.set("size", String(params.size));
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.keyword) searchParams.set("keyword", params.keyword);

  const query = searchParams.toString();
  const path = `/api/posts/${boardType}${query ? `?${query}` : ""}`;

  return backendJson<PostListResponse>(path);
};
