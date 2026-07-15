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
