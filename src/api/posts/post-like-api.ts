import { backendJson } from "@/api/client";

export type PostLikeToggleResponse = {
  postId: number;
  liked: boolean;
  likeCount: number;
};

export const togglePostLike = async (postId: number): Promise<PostLikeToggleResponse> => {
  return backendJson<PostLikeToggleResponse>(`/api/posts/${postId}/like`, {
    method: "POST",
  });
};
