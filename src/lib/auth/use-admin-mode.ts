"use client";

import { useCallback, useSyncExternalStore } from "react";
import { safeGetItem, safeRemoveItem, safeSetItem } from "@/shared/storage/safe-storage";
import { useAuthSession } from "./auth-session";
import { toNavUser } from "./to-nav-user";

const ADMIN_MODE_STORAGE_KEY = "aim.admin-mode";
const ADMIN_MODE_EVENT = "aim:admin-mode-changed";

type UseAdminModeResult = {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
};

// 저장값은 "관리 모드를 켜 둔 관리자의 uid"다. 브라우저를 공유해 다른 계정으로
// 로그인하면 uid가 달라져 자동으로 일반 모드가 된다.
// 한 번에 한 계정의 모드만 기억한다. 계정별로 따로 기억해야 하면 키를 uid별로 나눈다.
//
// localStorage 접근은 저장 차단 환경에서 SecurityError를 던지므로 safe-storage 헬퍼로만
// 접근한다. 읽기 실패는 일반 모드(false)로 간주하고, 쓰기 실패 시 호출부가 갱신 이벤트를
// 쏘지 않아 상태가 그대로 유지된다.
const isStoredAdminModeFor = (uid: string): boolean =>
  safeGetItem(ADMIN_MODE_STORAGE_KEY) === uid;

// 쓰기 성공 여부를 돌려준다. 실패하면 호출부가 갱신 이벤트를 쏘지 않는다.
const writeStoredAdminMode = (uid: string, next: boolean): boolean =>
  next ? safeSetItem(ADMIN_MODE_STORAGE_KEY, uid) : safeRemoveItem(ADMIN_MODE_STORAGE_KEY);

// 같은 탭은 커스텀 이벤트로, 다른 탭은 storage 이벤트로 갱신을 받는다.
const subscribe = (onStoreChange: () => void): (() => void) => {
  window.addEventListener(ADMIN_MODE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(ADMIN_MODE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

export const clearAdminMode = (): void => {
  if (!safeRemoveItem(ADMIN_MODE_STORAGE_KEY)) return;

  window.dispatchEvent(new Event(ADMIN_MODE_EVENT));
};

// 정적 export 프리렌더 시점에는 localStorage가 없으므로 일반 모드로 렌더한다.
// 실제 저장값은 하이드레이션 이후 getSnapshot으로 반영된다.
const getServerSnapshot = (): boolean => false;

/**
 * 관리자 모드(일반 모드 / 관리 모드) 상태를 다룬다.
 *
 * @param adminUid 로그인한 관리자의 uid. 비로그인이거나 관리자가 아니면 null을 넘긴다.
 *                 null이면 저장값과 무관하게 항상 일반 모드이고 토글도 동작하지 않는다.
 *
 * 새로고침·페이지 이동 후에도 유지되도록 localStorage에 저장한다.
 */
export const useAdminMode = (adminUid: string | null): UseAdminModeResult => {
  const getSnapshot = useCallback(
    () => (adminUid === null ? false : isStoredAdminModeFor(adminUid)),
    [adminUid],
  );

  const isAdminMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleAdminMode = useCallback(() => {
    if (adminUid === null) return;

    const next = !isStoredAdminModeFor(adminUid);
    if (!writeStoredAdminMode(adminUid, next)) return;

    window.dispatchEvent(new Event(ADMIN_MODE_EVENT));
  }, [adminUid]);

  return { isAdminMode, toggleAdminMode };
};

/**
 * 로그인 세션에서 관리자 여부와 uid를 직접 읽는 `useAdminMode`.
 *
 * Navigation을 렌더하는 곳이 AppLayout, 홈, 관리자 레이아웃 세 군데라
 * "관리자면 uid, 아니면 null" 판정을 세 번 반복하지 않도록 여기에 둔다.
 */
export const useSessionAdminMode = (): UseAdminModeResult => {
  const { session } = useAuthSession();
  const isAdmin = toNavUser(session)?.isAdmin ?? false;

  return useAdminMode(isAdmin ? (session?.uid ?? null) : null);
};
