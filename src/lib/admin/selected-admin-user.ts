import type { AdminUser } from "@/api/admin";

// 사용자 단건 조회 API가 없어 목록에서 고른 사용자를 탭 단위로 보관한다.
// 단건 API가 생기면 이 파일을 지우고 상세 화면에서 직접 조회한다.
const STORAGE_KEY = "admin:selected-user";

export const saveSelectedAdminUser = (user: AdminUser): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (cause) {
    console.error("[admin] 선택한 사용자 저장 실패", cause);
  }
};

export const readSelectedAdminUser = (userId: number): AdminUser | null => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const user = JSON.parse(stored) as AdminUser;
    return user.userId === userId ? user : null;
  } catch {
    return null;
  }
};
