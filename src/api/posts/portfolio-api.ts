import { backendJson } from "@/api/client";

export type PortfolioBoardType = "PORTFOLIO" | "COMPANY_PROJECT" | "LAB_INTERN";
export type PortfolioVisibility = "PUBLIC" | "PRIVATE";
export type PortfolioSort = "LATEST" | "POPULAR" | "VIEWS";

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

const portfolioSortComparators: Record<
  PortfolioSort,
  (a: PortfolioListItem, b: PortfolioListItem) => number
> = {
  LATEST: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  POPULAR: (a, b) => b.likeCount - a.likeCount,
  VIEWS: (a, b) => b.viewCount - a.viewCount,
};

const buildPortfolioPageableParams = ({
  page = 0,
  size = PORTFOLIO_DEFAULT_PAGE_SIZE,
  sort = "LATEST",
}: PortfolioPageable): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sortType", sort);
  return params;
};

const fetchSinglePortfolioPage = async (
  boardType: PortfolioBoardType,
  pageable: PortfolioPageable,
): Promise<PortfolioListPageResponse> => {
  const params = buildPortfolioPageableParams(pageable);
  // 공개 조회: 비로그인도 접근 가능
  return backendJson<PortfolioListPageResponse>(`/api/posts/${boardType}?${params.toString()}`, {
    requiresAuth: false,
  });
};

const fetchSinglePortfolioSearch = async (
  boardType: PortfolioBoardType,
  pageable: PortfolioPageable,
  keyword: string,
): Promise<PortfolioListPageResponse> => {
  const params = buildPortfolioPageableParams(pageable);
  params.set("boardType", boardType);
  if (keyword) {
    params.set("keyword", keyword);
  }
  // 공개 조회: 비로그인도 접근 가능
  return backendJson<PortfolioListPageResponse>(`/api/posts/search?${params.toString()}`, {
    requiresAuth: false,
  });
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
  return Array.from(new Set(boardTypes));
};

export const getPortfolioList = async ({
  boardTypes,
  page = 0,
  size = PORTFOLIO_DEFAULT_PAGE_SIZE,
  sort = "LATEST",
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
  sort = "LATEST",
}: SearchPortfoliosParams): Promise<PortfolioListPageResponse> => {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) {
    return getPortfolioList({ boardTypes, page, size, sort });
  }
  const resolved = resolveBoardTypes(boardTypes);
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
