"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthReady } from "@/lib/auth";
import { useTogglePostLike } from "@/lib/posts";
import { Button } from "@/shared/ui/button/button";
import { HeartIcon } from "@/shared/ui/icons";

export type PortfolioLikeButtonProps = {
  postId: number;
  initialLiked: boolean;
  initialLikeCount: number;
};

export const PortfolioLikeButton = ({
  postId,
  initialLiked,
  initialLikeCount,
}: PortfolioLikeButtonProps) => {
  const router = useRouter();
  const { isReady: isAuthReady, isAuthenticated } = useAuthReady();
  const { toggle, isPending } = useTogglePostLike();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleClick = async () => {
    if (isPending) return;

    // 좋아요는 로그인 필요 — 비로그인 시 로그인 페이지로 유도
    if (isAuthReady && !isAuthenticated) {
      router.push("/login");
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likeCount;
    const nextLiked = !previousLiked;

    setIsLiked(nextLiked);
    setLikeCount(previousCount + (nextLiked ? 1 : -1));

    const result = await toggle(postId);
    if (result === null) {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      return;
    }
    setIsLiked(result.liked);
    setLikeCount(result.likeCount);
  };

  return (
    <Button
      variant={isLiked ? "primary" : "secondary"}
      size="small"
      iconPosition="left"
      icon={<HeartIcon size={16} filled={isLiked} />}
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isLiked}
    >
      {likeCount}
    </Button>
  );
};
