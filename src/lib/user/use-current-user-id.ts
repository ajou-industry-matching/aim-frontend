"use client";

import { useAuthSession } from "@/lib/auth";

export type UseCurrentUserIdResult = {
  userId: number | null;
  // 인증 상태(및 세션) 확정 여부. 소유권 판정 시점 결정에 사용한다.
  isResolved: boolean;
};

// 로그인 시 저장된 백엔드 userId를 세션에서 읽어 반환한다.
// 응답이 불안정한 /api/users/me 대신 로그인 응답(LoginResponse.userId)을 사용한다.
export const useCurrentUserId = (): UseCurrentUserIdResult => {
  const { session, isAuthReady } = useAuthSession();

  return { userId: session?.userId ?? null, isResolved: isAuthReady };
};
