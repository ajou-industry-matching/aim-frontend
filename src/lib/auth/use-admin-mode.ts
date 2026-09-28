"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useAuthSession } from "./auth-session";
import { toNavUser } from "./to-nav-user";

const ADMIN_MODE_STORAGE_KEY = "aim.admin-mode";
const ADMIN_MODE_EVENT = "aim:admin-mode-changed";

type UseAdminModeResult = {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
};

const isStoredAdminMode = (): boolean =>
  window.localStorage.getItem(ADMIN_MODE_STORAGE_KEY) === "true";

/**
 * 저장된 관리자 모드를 지운다. 새 로그인이 성립하는 시점(`saveAuthSession`)에서 호출해
 * 이전 로그인의 모드가 다음 로그인으로 넘어가지 않게 한다.
 */
export const clearAdminMode = (): void => {
  window.localStorage.removeItem(ADMIN_MODE_STORAGE_KEY);
  window.dispatchEvent(new Event(ADMIN_MODE_EVENT));
};

// 같은 탭은 커스텀 이벤트로, 다른 탭은 storage 이벤트로 갱신을 받는다.
const subscribe = (onStoreChange: () => void): (() => void) => {
  window.addEventListener(ADMIN_MODE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(ADMIN_MODE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

// 정적 export 프리렌더 시점에는 localStorage가 없으므로 일반 모드로 렌더한다.
// 실제 저장값은 하이드레이션 이후 getSnapshot으로 반영된다.
const getServerSnapshot = (): boolean => false;

/**
 * 관리자 모드(일반 모드 / 관리 모드) 상태를 다룬다.
 *
 * @param isAdmin 관리자 권한 보유 여부. false면 저장값과 무관하게 항상 일반 모드이고
 *                토글도 동작하지 않는다.
 *
 * 새로고침·페이지 이동 후에도 유지되도록 localStorage에 저장한다. 로그인이 바뀌면
 * `saveAuthSession`이 `clearAdminMode`를 호출해 이전 로그인의 모드가 넘어오지 않는다.
 */
export const useAdminMode = (isAdmin: boolean): UseAdminModeResult => {
  const getSnapshot = useCallback(() => (isAdmin ? isStoredAdminMode() : false), [isAdmin]);

  const isAdminMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleAdminMode = useCallback(() => {
    if (!isAdmin) return;

    if (isStoredAdminMode()) {
      window.localStorage.removeItem(ADMIN_MODE_STORAGE_KEY);
    } else {
      window.localStorage.setItem(ADMIN_MODE_STORAGE_KEY, "true");
    }

    window.dispatchEvent(new Event(ADMIN_MODE_EVENT));
  }, [isAdmin]);

  return { isAdminMode, toggleAdminMode };
};

/**
 * 로그인 세션에서 관리자 여부를 직접 읽는 `useAdminMode`.
 *
 * Navigation을 렌더하는 곳이 AppLayout, 홈, 관리자 레이아웃 세 군데라
 * 관리자 판정을 세 번 반복하지 않도록 여기에 둔다.
 */
export const useSessionAdminMode = (): UseAdminModeResult =>
  useAdminMode(toNavUser(useAuthSession().session)?.isAdmin ?? false);
