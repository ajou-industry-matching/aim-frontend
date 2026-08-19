"use client";

import { useEffect, useState } from "react";
import { getMyProfile, type UserProfile } from "@/api/user";

export type UseMyProfileResult = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  // 편집 저장(PATCH) 성공 시 재조회 없이 로컬 상태를 갱신하는 데 사용.
  setProfile: (profile: UserProfile) => void;
};

const toErrorInstance = (cause: unknown): Error => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause);
  return new Error("프로필을 불러오지 못했습니다.");
};

export const useMyProfile = (): UseMyProfileResult => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    getMyProfile()
      .then((response) => {
        if (isCancelled) return;
        setProfile(response);
      })
      .catch((cause: unknown) => {
        if (isCancelled) return;
        console.error("프로필을 불러오지 못했습니다.", cause);
        setError(toErrorInstance(cause));
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return { profile, isLoading, error, setProfile };
};
