"use client";

import { useCallback, useSyncExternalStore } from "react";

const ADMIN_MODE_STORAGE_KEY = "aim.admin-mode";
const ADMIN_MODE_EVENT = "aim:admin-mode-changed";

type UseAdminModeResult = {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
};

const readStoredAdminMode = (): boolean =>
  window.localStorage.getItem(ADMIN_MODE_STORAGE_KEY) === "true";

// 같은 탭은 커스텀 이벤트로, 다른 탭은 storage 이벤트로 갱신을 받는다.
const subscribe = (onStoreChange: () => void): (() => void) => {
  window.addEventListener(ADMIN_MODE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(ADMIN_MODE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

// 정적 export 시점에는 localStorage가 없으므로 일반 모드로 렌더한다.
const getServerSnapshot = (): boolean => false;

/**
 * 관리자 모드(일반 모드 ↔ 관리 모드) 상태를 다룬다.
 *
 * 새로고침·페이지 이동 후에도 유지되도록 localStorage에 저장한다.
 * 관리자가 아닌 사용자에게는 저장된 값과 무관하게 항상 false를 반환한다.
 * (계정을 바꿔 로그인했을 때 이전 사용자의 모드가 남지 않도록)
 */
export const useAdminMode = (isAdmin: boolean): UseAdminModeResult => {
  const isStoredAdminMode = useSyncExternalStore(subscribe, readStoredAdminMode, getServerSnapshot);

  const toggleAdminMode = useCallback(() => {
    window.localStorage.setItem(ADMIN_MODE_STORAGE_KEY, String(!readStoredAdminMode()));
    window.dispatchEvent(new Event(ADMIN_MODE_EVENT));
  }, []);

  return { isAdminMode: isAdmin && isStoredAdminMode, toggleAdminMode };
};
