import { create } from "zustand";
import { getPosts } from "@/api/posts";
import type { Post, BoardType } from "@/api/posts";

export type SectionFilter = "학생 포트폴리오" | "기업 모집공고" | "연구실";

const FILTER_TO_BOARD: Record<SectionFilter, BoardType> = {
  "학생 포트폴리오": "PORTFOLIO",
  "기업 모집공고": "COMPANY_PROJECT",
  연구실: "LAB_INTERN",
};

const makeMock = (count: number, offset = 0): Post[] =>
  Array.from({ length: count }, (_, i) => ({
    postId: offset + i + 1,
    userId: i + 1,
    boardType: "PORTFOLIO" as const,
    title: `포트폴리오 프로젝트 ${offset + i + 1}`,
    description: "Next.js와 TypeScript를 활용한 웹 서비스 개발 프로젝트입니다.",
    visibility: "PUBLIC" as const,
    thumbnailImage: `https://picsum.photos/seed/${offset + i + 1}/360/203`,
    keywords:
      i % 3 === 0 ? ["React", "TypeScript"] : i % 3 === 1 ? ["Next.js", "Tailwind"] : ["Node.js"],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    likeCount: Math.floor(Math.random() * 50),
    commentCount: Math.floor(Math.random() * 20),
    viewCount: Math.floor(Math.random() * 200),
  }));

interface HomeState {
  newPosts: Post[];
  sectionPosts: Post[];
  noticePosts: Post[];
  sectionFilter: SectionFilter;
  isLoadingNew: boolean;
  isLoadingSection: boolean;
  isLoadingNotice: boolean;

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
  isLoadingNew: false,
  isLoadingSection: false,
  isLoadingNotice: false,

  fetchNewPosts: async () => {
    set({ isLoadingNew: true });
    try {
      const res = await getPosts("PORTFOLIO", { sort: "LATEST", size: 4, page: 0 });
      set({ newPosts: res.content });
    } catch {
      set({ newPosts: makeMock(4, 0) });
    } finally {
      set({ isLoadingNew: false });
    }
  },

  fetchSectionPosts: async (filter?: SectionFilter) => {
    const active = filter ?? get().sectionFilter;
    set({ isLoadingSection: true });
    try {
      const res = await getPosts(FILTER_TO_BOARD[active], { sort: "LATEST", size: 12, page: 0 });
      set({ sectionPosts: res.content });
    } catch {
      set({ sectionPosts: makeMock(12, 10) });
    } finally {
      set({ isLoadingSection: false });
    }
  },

  fetchNoticePosts: async () => {
    set({ isLoadingNotice: true });
    try {
      const res = await getPosts("NOTICE", { sort: "LATEST", size: 4, page: 0 });
      set({ noticePosts: res.content });
    } catch {
      set({ noticePosts: [] });
    } finally {
      set({ isLoadingNotice: false });
    }
  },

  setSectionFilter: (filter: SectionFilter) => {
    set({ sectionFilter: filter });
    void get().fetchSectionPosts(filter);
  },
}));
