import { create } from "zustand";
import { getPosts } from "@/api/posts";
import type { Post, BoardType } from "@/api/posts";

export type SectionFilter = "학생 포트폴리오" | "기업 모집공고" | "연구실";

const GENERIC_FETCH_ERROR_MESSAGE = "잠시 후 다시 시도해주세요.";

const FILTER_TO_BOARD: Record<SectionFilter, BoardType> = {
  "학생 포트폴리오": "PORTFOLIO",
  "기업 모집공고": "COMPANY_PROJECT",
  연구실: "LAB_INTERN",
};

interface HomeState {
  newPosts: Post[];
  sectionPosts: Post[];
  noticePosts: Post[];
  sectionFilter: SectionFilter;
  isLoadingNew: boolean;
  isLoadingSection: boolean;
  isLoadingNotice: boolean;
  newPostsError: string | null;
  sectionPostsError: string | null;
  noticePostsError: string | null;

  fetchNewPosts: () => Promise<void>;
  fetchSectionPosts: (filter?: SectionFilter) => Promise<void>;
  fetchNoticePosts: () => Promise<void>;
  setSectionFilter: (filter: SectionFilter) => void;
}

type PostsKey = "newPosts" | "sectionPosts" | "noticePosts";
type LoadingKey = "isLoadingNew" | "isLoadingSection" | "isLoadingNotice";
type ErrorKey = "newPostsError" | "sectionPostsError" | "noticePostsError";

interface LatestPostsRequest {
  boardType: BoardType;
  pageSize: number;
  postsKey: PostsKey;
  loadingKey: LoadingKey;
  errorKey: ErrorKey;
  errorMessage: string;
}

const createLatestPostsFetcher = (set: (state: Partial<HomeState>) => void) => {
  let latestRequestId = 0;

  return async ({
    boardType,
    pageSize,
    postsKey,
    loadingKey,
    errorKey,
    errorMessage,
  }: LatestPostsRequest) => {
    const requestId = ++latestRequestId;
    set({ [loadingKey]: true, [errorKey]: null } as Partial<HomeState>);
    try {
      const res = await getPosts(boardType, { sort: "LATEST", size: pageSize, page: 0 });
      if (requestId !== latestRequestId) return;
      set({ [postsKey]: res.content } as Partial<HomeState>);
    } catch (cause) {
      console.error(errorMessage, cause);
      if (requestId !== latestRequestId) return;
      set({
        [postsKey]: [],
        [errorKey]: GENERIC_FETCH_ERROR_MESSAGE,
      } as Partial<HomeState>);
    } finally {
      if (requestId === latestRequestId) {
        set({ [loadingKey]: false } as Partial<HomeState>);
      }
    }
  };
};

export const useHomeStore = create<HomeState>((set, get) => {
  const fetchNewPosts = createLatestPostsFetcher(set);
  const fetchSectionPosts = createLatestPostsFetcher(set);
  const fetchNoticePosts = createLatestPostsFetcher(set);

  return {
    newPosts: [],
    sectionPosts: [],
    noticePosts: [],
    sectionFilter: "학생 포트폴리오",
    isLoadingNew: true,
    isLoadingSection: true,
    isLoadingNotice: true,
    newPostsError: null,
    sectionPostsError: null,
    noticePostsError: null,

    fetchNewPosts: async () => {
      await fetchNewPosts({
        boardType: "PORTFOLIO",
        pageSize: 4,
        postsKey: "newPosts",
        loadingKey: "isLoadingNew",
        errorKey: "newPostsError",
        errorMessage: "Failed to fetch new posts",
      });
    },

    fetchSectionPosts: async (filter?: SectionFilter) => {
      const active = filter ?? get().sectionFilter;
      await fetchSectionPosts({
        boardType: FILTER_TO_BOARD[active],
        pageSize: 12,
        postsKey: "sectionPosts",
        loadingKey: "isLoadingSection",
        errorKey: "sectionPostsError",
        errorMessage: "Failed to fetch section posts",
      });
    },

    fetchNoticePosts: async () => {
      await fetchNoticePosts({
        boardType: "NOTICE",
        pageSize: 4,
        postsKey: "noticePosts",
        loadingKey: "isLoadingNotice",
        errorKey: "noticePostsError",
        errorMessage: "Failed to fetch notice posts",
      });
    },

    setSectionFilter: (filter: SectionFilter) => {
      if (get().sectionFilter === filter) return;
      set({ sectionFilter: filter });
      void get().fetchSectionPosts(filter);
    },
  };
});
