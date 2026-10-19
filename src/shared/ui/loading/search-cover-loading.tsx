import { Loading } from "./loading";

/**
 * 홈 검색 → 포트폴리오 결과로 넘어가는 동안 화면을 덮는 로딩.
 * 전환 구간(Suspense fallback)과 도착 화면 첫 렌더 두 곳에서 같은 화면을 써야
 * 로딩이 두 번 뜬 것처럼 보이지 않으므로, 문구·크기·애니메이션 여부를 여기서만 정한다.
 *
 * 이동 직후에는 덮을 이전 화면이 없어 아치를 올리지 않고 덮인 상태로 바로 표시한다.
 */
export const SearchCoverLoading = (): React.ReactElement => (
  <Loading
    isFullScreen
    hasEnterAnimation={false}
    text="포트폴리오를 검색하고 있어요"
    size="large"
  />
);
