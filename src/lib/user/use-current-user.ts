"use client";

import { useEffect, useState } from "react";
import { getMyProfile, type MyProfile } from "@/api/users";
import { useAuthReady } from "@/lib/auth";

export type UseCurrentUserResult = {
  profile: MyProfile | null;
  // 프로필 조회가 끝났는지(성공/실패 무관). 소유자 판별 등에서 판단 시점을 결정할 때 사용한다.
  isResolved: boolean;
};

// 로그인 사용자의 백엔드 프로필(userId 포함)을 조회한다.
// 세션에는 백엔드 userId가 없어 소유자 판별 등에 필요하다.
export const useCurrentUser = (): UseCurrentUserResult => {
  const { isReady, isAuthenticated } = useAuthReady();
  const [fetchedProfile, setFetchedProfile] = useState<MyProfile | null>(null);
  const [isFetchResolved, setIsFetchResolved] = useState(false);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;

    let isCancelled = false;

    getMyProfile()
      .then((response) => {
        if (isCancelled) return;
        setFetchedProfile(response);
      })
      .catch(() => {
        if (isCancelled) return;
        setFetchedProfile(null);
      })
      .finally(() => {
        if (isCancelled) return;
        setIsFetchResolved(true);
      });

    return () => {
      isCancelled = true;
    };
  }, [isReady, isAuthenticated]);

  // 로그아웃/미인증 상태에서는 이전 조회 결과를 노출하지 않는다(스테일 데이터 방지).
  // 미인증은 조회할 프로필이 없으므로 인증 확정(isReady) 시점에 바로 resolved 처리한다.
  const profile = isReady && isAuthenticated ? fetchedProfile : null;
  const isResolved = isReady && (!isAuthenticated || isFetchResolved);

  return { profile, isResolved };
};
