import { PageLoading } from "@/shared/ui/loading";

// app/ 하위 모든 라우트의 전환 로딩.
// 각 페이지의 데이터 로딩도 같은 PageLoading을 써서 전환 내내 한 번의 로딩으로 보이게 한다.
export default function RouteLoading(): React.ReactElement {
  return <PageLoading />;
}
