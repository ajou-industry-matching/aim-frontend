// 목록 GET 응답용 경량 클라이언트 캐시
// - TTL 동안 동일 요청은 네트워크 없이 재사용 → 홈↔목록↔뒤로가기 재진입 시 재요청 제거
// - in-flight 요청 dedup → 같은 키의 동시 호출(홈 섹션/중복 진입)을 한 번의 네트워크로 합침
// 모듈 레벨 Map이라 전체 새로고침 시 초기화된다(정적 export/CSR 환경에 적합).

const DEFAULT_TTL_MS = 30_000;

type CacheEntry<T> = { value: T; expiresAt: number };

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export const cachedGet = <T>(
  key: string,
  loader: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS,
): Promise<T> => {
  const now = Date.now();

  const hit = store.get(key) as CacheEntry<T> | undefined;
  if (hit && hit.expiresAt > now) {
    return Promise.resolve(hit.value);
  }

  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) {
    return pending;
  }

  const promise = loader()
    .then((value) => {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
};

// 게시글 작성/수정 등으로 목록이 바뀐 뒤 강제 무효화가 필요할 때 사용.
export const clearListCache = (): void => {
  store.clear();
  inflight.clear();
};
