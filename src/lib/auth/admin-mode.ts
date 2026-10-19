"use client";

import { useCallback, useEffect, useState } from "react";

const ADMIN_MODE_STORAGE_KEY = "aim-admin-mode";
const ADMIN_MODE_EVENT = "aim-admin-mode-changed";

const readStoredAdminMode = (): boolean =>
  window.localStorage.getItem(ADMIN_MODE_STORAGE_KEY) === "true";

const emitAdminModeChanged = () => {
  window.dispatchEvent(new Event(ADMIN_MODE_EVENT));
};

export const clearAdminMode = (): void => {
  window.localStorage.removeItem(ADMIN_MODE_STORAGE_KEY);
  emitAdminModeChanged();
};

// 관리자 모드는 레이아웃(일반/관리)마다 Navigation이 따로 렌더링되므로
// localStorage + 이벤트로 공유한다. 저장값을 setState로 직접 바꾸지 않고
// 이벤트로만 갱신해 같은 탭의 모든 구독자가 동일한 값을 보게 한다.
export const useAdminMode = (
  isAdmin: boolean,
): { isAdminMode: boolean; toggleAdminMode: () => void } => {
  const [storedAdminMode, setStoredAdminMode] = useState(false);

  useEffect(() => {
    const syncAdminMode = () => {
      setStoredAdminMode(readStoredAdminMode());
    };

    syncAdminMode();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ADMIN_MODE_STORAGE_KEY) {
        syncAdminMode();
      }
    };

    window.addEventListener(ADMIN_MODE_EVENT, syncAdminMode);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(ADMIN_MODE_EVENT, syncAdminMode);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleAdminMode = useCallback(() => {
    window.localStorage.setItem(ADMIN_MODE_STORAGE_KEY, String(!readStoredAdminMode()));
    emitAdminModeChanged();
  }, []);

  // 권한이 없으면 저장값과 무관하게 일반 모드로 강제한다(세션 만료·권한 회수 대응).
  return { isAdminMode: isAdmin && storedAdminMode, toggleAdminMode };
};
