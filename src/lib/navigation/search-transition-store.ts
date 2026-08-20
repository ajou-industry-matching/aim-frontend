import { create } from "zustand";

// 이동이 실패하거나 뒤로가기로 벗어나도 덮개가 화면에 남지 않도록 두는 최후 안전장치.
// 정상 흐름에서는 결과가 준비되는 즉시 end()가 불려 여기까지 오지 않는다.
const SAFETY_TIMEOUT_MS = 10_000;

let safetyTimer: ReturnType<typeof setTimeout> | null = null;

const clearSafetyTimer = () => {
  if (safetyTimer === null) return;
  clearTimeout(safetyTimer);
  safetyTimer = null;
};

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
  start: () => {
    clearSafetyTimer();
    safetyTimer = setTimeout(() => {
      safetyTimer = null;
      set({ isActive: false });
    }, SAFETY_TIMEOUT_MS);
    set({ isActive: true });
  },
  end: () => {
    clearSafetyTimer();
    set({ isActive: false });
  },
}));
