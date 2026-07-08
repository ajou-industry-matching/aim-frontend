import { backendJson } from "@/api/client";

export type MyProfileRole = "STUDENT" | "PROFESSOR" | "COMPANY";

// GET /api/users/me 응답
export type MyProfile = {
  userId: number;
  name: string;
  email: string;
  role: MyProfileRole;
  department: string;
  profileBio: string;
  postCount: number;
  likeCount: number;
};

export const getMyProfile = async (): Promise<MyProfile> => {
  return backendJson<MyProfile>("/api/users/me", { requiresAuth: true });
};
