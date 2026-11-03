// 크롤러(aim-crawler CATEGORY_MAP)의 소프트콘 분류 코드.
const CATEGORY_LABELS: Record<string, string> = {
  S: "SW캡스톤디자인",
  I: "AI융합 캡스톤디자인",
  D: "사이버보안캡스톤디자인",
  M: "자기주도연구",
  P: "자기주도 프로젝트",
  R: "미디어 프로젝트",
  W: "SW기초교육",
  E: "기타활동",
  A: "AI집중교육",
  T: "SWeat 온라인 튜터링",
  C: "국방ICT프로젝트",
};

// 코드가 아닌 값(다른 크롤링 출처의 라벨)은 그대로 보여준다.
export const toCategoryLabel = (category: string): string => CATEGORY_LABELS[category] ?? category;
