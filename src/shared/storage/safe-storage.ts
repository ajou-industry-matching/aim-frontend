// 사파리 프라이빗·사이트 데이터 차단·일부 기업 정책 환경에서는 localStorage 접근 자체가
// SecurityError를 던진다. 가드 없이 쓰면 첫 렌더/로그인/세션 경로가 통째로 멈추므로,
// 모든 localStorage 접근을 아래 헬퍼로만 수행한다(읽기 실패는 null, 쓰기 실패는 false).
export const safeGetItem = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

// 저장 성공 여부를 돌려준다. 호출부가 성공했을 때만 갱신 이벤트를 쏘도록 판단에 쓴다.
export const safeSetItem = (key: string, value: string): boolean => {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const safeRemoveItem = (key: string): boolean => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};
