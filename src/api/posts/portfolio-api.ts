import { backendJson } from "@/api/client";

export type PortfolioBoardType = "PORTFOLIO" | "COMPANY_PROJECT" | "LAB_INTERN";
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

export type PortfolioPageable = {
  page?: number;
  size?: number;
  sort?: PortfolioSort;
};

export type GetPortfolioListParams = PortfolioPageable & {
  boardTypes?: PortfolioBoardType[];
};

export type SearchPortfoliosParams = GetPortfolioListParams & {
  keyword: string;
};

export const PORTFOLIO_BOARD_TYPES_ALL: PortfolioBoardType[] = [
  "PORTFOLIO",
  "COMPANY_PROJECT",
  "LAB_INTERN",
];

const PORTFOLIO_DEFAULT_PAGE_SIZE = 12;

const portfolioSortToQueryValue: Record<PortfolioSort, string> = {
  latest: "createdAt,desc",
  popular: "likeCount,desc",
  views: "viewCount,desc",
};

const portfolioSortComparators: Record<
  PortfolioSort,
  (a: PortfolioListItem, b: PortfolioListItem) => number
> = {
  latest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  popular: (a, b) => b.likeCount - a.likeCount,
  views: (a, b) => b.viewCount - a.viewCount,
};

const buildPortfolioPageableQuery = ({
  page = 0,
  size = PORTFOLIO_DEFAULT_PAGE_SIZE,
  sort = "latest",
}: PortfolioPageable): string => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sort", portfolioSortToQueryValue[sort]);
  return params.toString();
};

const fetchSinglePortfolioPage = async (
  boardType: PortfolioBoardType,
  pageable: PortfolioPageable,
): Promise<PortfolioListPageResponse> => {
  const query = buildPortfolioPageableQuery(pageable);
  return backendJson<PortfolioListPageResponse>(`/api/posts/${boardType}?${query}`);
};

const fetchSinglePortfolioSearch = async (
  boardType: PortfolioBoardType,
  pageable: PortfolioPageable,
  keyword: string,
): Promise<PortfolioListPageResponse> => {
  const query = buildPortfolioPageableQuery(pageable);
  const params = new URLSearchParams(query);
  params.set("boardType", boardType);
  if (keyword) {
    params.set("keyword", keyword);
  }
  return backendJson<PortfolioListPageResponse>(`/api/posts/search?${params.toString()}`);
};

const mergePortfolioPages = (
  responses: PortfolioListPageResponse[],
  { page, size, sort }: Required<PortfolioPageable>,
): PortfolioListPageResponse => {
  const merged = responses.flatMap((response) => response.content);
  const sorted = [...merged].sort(portfolioSortComparators[sort]);
  const start = page * size;
  const sliced = sorted.slice(start, start + size);
  const totalElements = responses.reduce((sum, response) => sum + response.totalElements, 0);
  return {
    content: sliced,
    page,
    size,
    totalElements,
    totalPages: Math.max(1, Math.ceil(totalElements / size)),
  };
};

const resolveBoardTypes = (boardTypes?: PortfolioBoardType[]): PortfolioBoardType[] => {
  if (!boardTypes || boardTypes.length === 0) return PORTFOLIO_BOARD_TYPES_ALL;
  return boardTypes;
};

export const getPortfolioList = async ({
  boardTypes,
  page = 0,
  size = PORTFOLIO_DEFAULT_PAGE_SIZE,
  sort = "latest",
}: GetPortfolioListParams = {}): Promise<PortfolioListPageResponse> => {
  const resolved = resolveBoardTypes(boardTypes);
  if (resolved.length === 1) {
    return fetchSinglePortfolioPage(resolved[0], { page, size, sort });
  }
  const fetchSize = (page + 1) * size;
  const responses = await Promise.all(
    resolved.map((boardType) =>
      fetchSinglePortfolioPage(boardType, { page: 0, size: fetchSize, sort }),
    ),
  );
  return mergePortfolioPages(responses, { page, size, sort });
};

export const searchPortfolios = async ({
  boardTypes,
  keyword,
  page = 0,
  size = PORTFOLIO_DEFAULT_PAGE_SIZE,
  sort = "latest",
}: SearchPortfoliosParams): Promise<PortfolioListPageResponse> => {
  const resolved = resolveBoardTypes(boardTypes);
  const trimmedKeyword = keyword.trim();
  if (resolved.length === 1) {
    return fetchSinglePortfolioSearch(resolved[0], { page, size, sort }, trimmedKeyword);
  }
  const fetchSize = (page + 1) * size;
  const responses = await Promise.all(
    resolved.map((boardType) =>
      fetchSinglePortfolioSearch(boardType, { page: 0, size: fetchSize, sort }, trimmedKeyword),
    ),
  );
  return mergePortfolioPages(responses, { page, size, sort });
};
