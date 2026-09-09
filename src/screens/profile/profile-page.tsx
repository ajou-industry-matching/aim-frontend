"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthReady } from "@/lib/auth";
import { PageLoading } from "@/shared/ui/loading";
import { ProfileContent } from "./profile-content";

export const ProfilePage = () => {
  const router = useRouter();
  const { isReady, isAuthenticated } = useAuthReady();

  // 프로필은 로그인 전용. 인증이 확정된 뒤 미인증이면 로그인 페이지로 보낸다.
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isReady, isAuthenticated, router]);

  // 인증 확정 전(또는 리다이렉트 대기 중)에는 로딩만 표시한다.
  // 인증이 확정된 뒤에만 ProfileContent를 마운트해, 개인화 API를 유효한 토큰으로 호출한다.
  if (!isReady || !isAuthenticated) {
    return <PageLoading />;
  }

  return <ProfileContent />;
};
