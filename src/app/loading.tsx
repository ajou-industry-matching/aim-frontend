import { Loading } from "@/shared/ui/loading";

// app/ 하위 모든 라우트의 페이지 전환 로딩. 전체화면 아치는 홈 검색 전환에만 쓰므로 여기서는 미사용.
export default function RouteLoading(): React.ReactElement {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <Loading text="불러오는 중" size="large" />
    </div>
  );
}
