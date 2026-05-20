import { backendJson } from "@/api/client";

export type PortfolioBoardType = "PORTFOLIO";
export type PortfolioVisibility = "PUBLIC" | "PRIVATE";
export type PortfolioSort = "latest" | "popular" | "views";

export type PortfolioKeyword = {
  keywordId: number;
  keywordName: string;
};

export type PortfolioListItem = {
  postId: number;
  userId: number;
  boardType: PortfolioBoardType;
  title: string;
  description: string;
  visibility: PortfolioVisibility;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  thumbnailImage: string | null;
  liked: boolean;
  keywords: PortfolioKeyword[];
};

export type PortfolioListPageResponse = {
  content: PortfolioListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type GetPortfolioListParams = {
  page?: number;
  size?: number;
  sort?: PortfolioSort;
};

export type SearchPortfoliosParams = GetPortfolioListParams & {
  keyword: string;
};

const PORTFOLIO_DEFAULT_PAGE_SIZE = 12;

const portfolioSortToQueryValue: Record<PortfolioSort, string> = {
  latest: "createdAt,desc",
  popular: "likeCount,desc",
  views: "viewCount,desc",
};

const buildPortfolioPageableQuery = ({
  page = 0,
  size = PORTFOLIO_DEFAULT_PAGE_SIZE,
  sort = "latest",
}: GetPortfolioListParams): string => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sort", portfolioSortToQueryValue[sort]);
  return params.toString();
};

export const getPortfolioList = async (
  params: GetPortfolioListParams = {},
): Promise<PortfolioListPageResponse> => {
  const query = buildPortfolioPageableQuery(params);
  return backendJson<PortfolioListPageResponse>(`/api/posts/PORTFOLIO?${query}`);
};

export const searchPortfolios = async ({
  keyword,
  ...pageable
}: SearchPortfoliosParams): Promise<PortfolioListPageResponse> => {
  const query = buildPortfolioPageableQuery(pageable);
  const params = new URLSearchParams(query);
  params.set("boardType", "PORTFOLIO");
  if (keyword.trim()) {
    params.set("keyword", keyword.trim());
  }
  return backendJson<PortfolioListPageResponse>(`/api/posts/search?${params.toString()}`);
};
