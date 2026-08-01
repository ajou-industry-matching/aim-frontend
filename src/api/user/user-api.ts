import type { AuthRole } from "@/api/auth";
import { backendJson } from "@/api/client";

// GET /api/users/me 응답
export type UserProfile = {
  userId: number;
  name: string;
  email: string;
  role: AuthRole;
  department: string;
  profileBio: string;
  postCount: number;
  likeCount: number;
};

// PATCH /api/users/me 요청 (수정 가능한 필드만)
export type UpdateProfileRequest = {
  name: string;
  profileBio: string;
};

// 내 프로필 조회 (로그인 필수)
export const getMyProfile = async (): Promise<UserProfile> =>
  backendJson<UserProfile>("/api/users/me");

// 내 프로필 수정 (이름/자기소개만 변경 가능)
export const updateMyProfile = async (request: UpdateProfileRequest): Promise<UserProfile> =>
  backendJson<UserProfile>("/api/users/me", {
    method: "PATCH",
    json: request,
  });
