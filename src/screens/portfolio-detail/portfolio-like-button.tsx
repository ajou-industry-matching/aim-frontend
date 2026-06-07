"use client";

import { useState } from "react";
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
  const { toggle, isPending } = useTogglePostLike();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleClick = async () => {
    if (isPending) return;

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
