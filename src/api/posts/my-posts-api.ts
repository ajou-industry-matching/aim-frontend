import { cachedGet } from "@/api/cache";
import { authScopeKey, backendJson } from "@/api/client";
import {
  buildPortfolioPageableParams,
  type PortfolioListPageResponse,
  type PortfolioPageable,
} from "./portfolio-api";

// GET /api/posts/my — 내가 작성한 게시글 목록 (로그인 필수)
export const getMyPosts = async (
  pageable: PortfolioPageable = {},
): Promise<PortfolioListPageResponse> => {
  const params = buildPortfolioPageableParams(pageable);
  const path = `/api/posts/my?${params.toString()}`;
  return cachedGet(`${authScopeKey()}|${path}`, () => backendJson<PortfolioListPageResponse>(path));
};

// GET /api/posts/liked — 내가 좋아요한 게시글 목록 (로그인 필수)
// 백엔드가 정렬(sortType)을 지원하지 않아 page/size만 유효하다.
export const getLikedPosts = async (
  pageable: PortfolioPageable = {},
): Promise<PortfolioListPageResponse> => {
  const params = buildPortfolioPageableParams(pageable);
  // /api/posts/liked 는 정렬을 지원하지 않으므로 sortType 파라미터를 제거한다.
  params.delete("sortType");
  const path = `/api/posts/liked?${params.toString()}`;
  return cachedGet(`${authScopeKey()}|${path}`, () => backendJson<PortfolioListPageResponse>(path));
};
