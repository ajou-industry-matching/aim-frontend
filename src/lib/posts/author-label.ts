// authorName 키를 필수로 둬야 호출부가 값을 빠뜨렸을 때 타입 오류가 난다. 값이 비는 경우는 null로 받는다.
export type AuthorSource = {
  userId: number;
  authorName: string | null;
};

// 작성자 이름(authorName)을 표시하고, 비어있으면 폴백 문구(기본: 사용자 ID)를 쓴다.
export const toAuthorLabel = (
  { authorName, userId }: AuthorSource,
  fallback = `사용자 ${userId}`,
): string => authorName?.trim() || fallback;
