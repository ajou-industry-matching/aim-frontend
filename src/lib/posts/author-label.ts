type AuthorSource = {
  userId: number;
  authorName?: string | null;
};

// 작성자 이름(authorName)을 표시하고, 비어있으면 폴백 문구(기본: 사용자 ID)를 쓴다.
export const toAuthorLabel = (
  { authorName, userId }: AuthorSource,
  fallback = `사용자 ${userId}`,
): string => authorName?.trim() || fallback;
