import { Loading } from "./loading";

/**
 * 화면 전체를 채우는 로딩. 라우트 전환 로딩(`app/loading.tsx`)과
 * 페이지 데이터 로딩이 **완전히 같은 화면**을 쓰도록 한 곳에서 정의한다.
 * 둘이 조금이라도 다르면 로딩이 두 번 뜬 것처럼 보인다.
 */
export const PageLoading = (): React.ReactElement => (
  <div className="flex min-h-screen w-full items-center justify-center bg-white">
    <Loading text="불러오는 중" size="large" />
  </div>
);
