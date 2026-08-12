import type { AuthRole } from "@/api/auth";

// 회원 종류(role) → 한국어 라벨. 헤더/프로필/편집 모달에서 공용으로 사용한다.
export const authRoleLabels = {
  STUDENT: "학생",
  PROFESSOR: "교수",
  COMPANY: "기업",
} as const satisfies Record<AuthRole, string>;
