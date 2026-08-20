import { create } from "zustand";

interface SearchTransitionState {
  /** 검색 전환(홈 → 포트폴리오 결과)이 진행 중인지 */
  isActive: boolean;
  /** 덮개를 띄운다. 라우트가 바뀌어도 레이아웃에 붙어 있어 그대로 유지된다. */
  start: () => void;
  /** 결과가 준비되면 덮개를 걷는다. */
  end: () => void;
}

export const useSearchTransitionStore = create<SearchTransitionState>((set) => ({
  isActive: false,
  start: () => set({ isActive: true }),
  end: () => set({ isActive: false }),
}));
