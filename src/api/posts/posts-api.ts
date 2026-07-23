import { authScopeKey, backendJson } from "@/api/client";
import { cachedGet } from "@/api/cache";
import {
  buildPortfolioPageableParams,
  getPortfolioList,
  PORTFOLIO_BOARD_TYPES_ALL,
  searchPortfolios,
  type PortfolioBoardType,
  type PortfolioKeyword,
  type PortfolioListItem,
} from "./portfolio-api";
import type { PortfolioAttachment } from "./portfolio-detail-api";

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
  authorName?: string;
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

type RawPostKeyword = {
  keywordId: number;
  keywordName: string;
};

type RawPost = Omit<Post, "keywords"> & {
  keywords?: RawPostKeyword[] | null;
};

type RawPostListResponse = Omit<PostListResponse, "content"> & {
  content: RawPost[];
};

const portfolioBoardTypes: ReadonlySet<BoardType> = new Set(PORTFOLIO_BOARD_TYPES_ALL);

const isPortfolioBoardType = (boardType: BoardType): boardType is PortfolioBoardType =>
  portfolioBoardTypes.has(boardType);

const normalizeKeyword = (keyword: RawPostKeyword): string => keyword.keywordName;

const mapPortfolioItemToPost = (item: PortfolioListItem): Post => ({
  ...item,
  thumbnailImage: item.thumbnailImage ?? undefined,
  liked: item.liked,
  keywords: item.keywords.map((keyword: PortfolioKeyword) => keyword.keywordName),
});

const mapPortfolioResponseToPosts = (res: {
  content: PortfolioListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}): PostListResponse => ({
  ...res,
  content: res.content.map(mapPortfolioItemToPost),
});

const normalizePosts = (res: RawPostListResponse): PostListResponse => ({
  ...res,
  content: res.content.map((post) => ({
    ...post,
    keywords: (post.keywords ?? []).map(normalizeKeyword),
  })),
});

export const getPosts = async (
  boardType: BoardType,
  params?: GetPostsParams,
): Promise<PostListResponse> => {
  if (isPortfolioBoardType(boardType)) {
    const portfolioParams = {
      boardTypes: [boardType],
      page: params?.page,
      size: params?.size,
      sort: params?.sort,
    };
    const response = params?.keyword
      ? await searchPortfolios({ ...portfolioParams, keyword: params.keyword })
      : await getPortfolioList(portfolioParams);

    return mapPortfolioResponseToPosts(response);
  }

  const searchParams = buildPortfolioPageableParams({
    page: params?.page,
    size: params?.size,
    sort: params?.sort,
  });
  if (params?.keyword) searchParams.set("keyword", params.keyword);
  const query = searchParams.toString();
  const path = params?.keyword
    ? `/api/posts/search?boardType=${boardType}${query ? `&${query}` : ""}`
    : `/api/posts/${boardType}${query ? `?${query}` : ""}`;

  const res = await cachedGet(`${authScopeKey()}|${path}`, () =>
    backendJson<RawPostListResponse>(path, { requiresAuth: false }),
  );
  return normalizePosts(res);
};

export type PostDetail = {
  postId: number;
  userId: number;
  authorName?: string;
  boardType: BoardType;
  title: string;
  content: string;
  description: string;
  videoLink: string | null;
  githubLink: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  thumbnailImage: string | null;
  liked: boolean | null;
  keywords: PortfolioKeyword[];
  images: PortfolioAttachment[];
  files: PortfolioAttachment[];
};

export type PostCreateRequest = {
  title: string;
  description?: string;
  content?: string;
  videoLink?: string;
  githubLink?: string;
  visibility?: "PUBLIC" | "PRIVATE";
  keywordIds?: number[];
};

export type PostUpdateRequest = PostCreateRequest & {
  deleteAttachmentIds?: number[];
};

export type PostMutationFiles = {
  thumbnail?: File | null;
  images?: File[];
  files?: File[];
};

export type DeletePostResponse = {
  postId: number;
};

// Spring이 request 파트를 application/json으로 파싱하므로 문자열이 아닌 Blob으로 감싼다.
// (문자열로 append하면 text/plain으로 전송되어 415 응답)
const buildPostFormData = (
  request: PostCreateRequest | PostUpdateRequest,
  files?: PostMutationFiles,
): FormData => {
  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  if (files?.thumbnail) formData.append("thumbnail", files.thumbnail);
  files?.images?.forEach((image) => formData.append("images", image));
  files?.files?.forEach((file) => formData.append("files", file));
  return formData;
};

export const getPostDetail = async (boardType: BoardType, postId: number): Promise<PostDetail> => {
  // 공개 조회: 비로그인도 접근 가능 (로그인 시 liked 등 개인화 정보 포함)
  return backendJson<PostDetail>(`/api/posts/${boardType}/${postId}`, {
    requiresAuth: false,
  });
};

export const createPost = async (
  boardType: BoardType,
  request: PostCreateRequest,
  files?: PostMutationFiles,
): Promise<PostDetail> => {
  return backendJson<PostDetail>(`/api/posts/${boardType}`, {
    method: "POST",
    body: buildPostFormData(request, files),
  });
};

export const updatePost = async (
  boardType: BoardType,
  postId: number,
  request: PostUpdateRequest,
  files?: PostMutationFiles,
): Promise<PostDetail> => {
  return backendJson<PostDetail>(`/api/posts/${boardType}/${postId}`, {
    method: "PUT",
    body: buildPostFormData(request, files),
  });
};

export const deletePost = async (
  boardType: BoardType,
  postId: number,
): Promise<DeletePostResponse> => {
  return backendJson<DeletePostResponse>(`/api/posts/${boardType}/${postId}`, {
    method: "DELETE",
  });
};
