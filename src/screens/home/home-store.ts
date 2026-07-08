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

let newPostsRequestId = 0;
let sectionPostsRequestId = 0;
let noticePostsRequestId = 0;

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

export const useHomeStore = create<HomeState>((set, get) => ({
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
    const requestId = ++newPostsRequestId;
    set({ isLoadingNew: true, newPostsError: null });
    try {
      const res = await getPosts("PORTFOLIO", { sort: "LATEST", size: 4, page: 0 });
      if (requestId !== newPostsRequestId) return;
      set({ newPosts: res.content });
    } catch (cause) {
      console.error("Failed to fetch new posts", cause);
      if (requestId !== newPostsRequestId) return;
      set({
        newPosts: [],
        newPostsError: GENERIC_FETCH_ERROR_MESSAGE,
      });
    } finally {
      if (requestId === newPostsRequestId) {
        set({ isLoadingNew: false });
      }
    }
  },

  fetchSectionPosts: async (filter?: SectionFilter) => {
    const active = filter ?? get().sectionFilter;
    const requestId = ++sectionPostsRequestId;
    set({ isLoadingSection: true, sectionPostsError: null });
    try {
      const res = await getPosts(FILTER_TO_BOARD[active], { sort: "LATEST", size: 12, page: 0 });
      if (requestId !== sectionPostsRequestId) return;
      set({ sectionPosts: res.content });
    } catch (cause) {
      console.error("Failed to fetch section posts", cause);
      if (requestId !== sectionPostsRequestId) return;
      set({
        sectionPosts: [],
        sectionPostsError: GENERIC_FETCH_ERROR_MESSAGE,
      });
    } finally {
      if (requestId === sectionPostsRequestId) {
        set({ isLoadingSection: false });
      }
    }
  },

  fetchNoticePosts: async () => {
    const requestId = ++noticePostsRequestId;
    set({ isLoadingNotice: true, noticePostsError: null });
    try {
      const res = await getPosts("NOTICE", { sort: "LATEST", size: 4, page: 0 });
      if (requestId !== noticePostsRequestId) return;
      set({ noticePosts: res.content });
    } catch (cause) {
      console.error("Failed to fetch notice posts", cause);
      if (requestId !== noticePostsRequestId) return;
      set({
        noticePosts: [],
        noticePostsError: GENERIC_FETCH_ERROR_MESSAGE,
      });
    } finally {
      if (requestId === noticePostsRequestId) {
        set({ isLoadingNotice: false });
      }
    }
  },

  setSectionFilter: (filter: SectionFilter) => {
    set({ sectionFilter: filter });
    void get().fetchSectionPosts(filter);
  },
}));
