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
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;

    let isCancelled = false;

    getMyProfile()
      .then((response) => {
        if (isCancelled) return;
        setProfile(response);
      })
      .catch(() => {
        if (isCancelled) return;
        setProfile(null);
      })
      .finally(() => {
        if (isCancelled) return;
        setIsResolved(true);
      });

    return () => {
      isCancelled = true;
    };
  }, [isReady, isAuthenticated]);

  return { profile, isResolved };
};
