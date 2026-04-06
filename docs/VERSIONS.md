# 의존성 버전 관리

이 문서는 현재 프로젝트의 주요 의존성 버전과 운영 기준을 빠르게 확인하기 위한 문서입니다.  
상세 변경 맥락은 PR과 관련 설계 문서를 참고하고, 이 문서에는 "지금 기준으로 무엇을 쓰고 있는가"를 우선적으로 정리합니다.

---

## 현재 기준

### 런타임 환경

| 항목 | 버전 | 비고 |
|---|---|---|
| Node.js | 20.x | v22 LTS 업그레이드 검토 중 |
| pnpm | 10.20.0 | 팀 공통 패키지 매니저 |

### 프로덕션 의존성

| 패키지 | 버전 | 설명 |
|---|---|---|
| `next` | ^16.2.1 | App Router 기반 프레임워크 |
| `react` | 19.2.4 | UI 프레임워크 |
| `react-dom` | ^19.2.4 | React DOM 렌더러 |
| `firebase` | ^12.9.0 | Hosting, Firestore, Storage, Auth |
| `@tiptap/react` | ^3.21.0 | 리치 텍스트 에디터 React 바인딩 |
| `@tiptap/pm` | ^3.21.0 | Tiptap ProseMirror 패키지 |
| `@tiptap/starter-kit` | ^3.21.0 | 기본 에디터 확장 묶음 |
| `tiptap-extension-global-drag-handle` | ^0.1.18 | 블록 드래그 핸들 확장 |
| `tiptap-extension-auto-joiner` | ^0.1.3 | 인접 블록 자동 결합 확장 |

### 개발 의존성

| 패키지 | 버전 | 설명 |
|---|---|---|
| `typescript` | ~5.9.3 | 타입스크립트 컴파일러 |
| `tailwindcss` | ^4.2.0 | CSS 프레임워크 |
| `@tailwindcss/postcss` | ^4.1.18 | Tailwind PostCSS 플러그인 |
| `postcss` | ^8.5.6 | CSS 후처리기 |
| `autoprefixer` | ^10.4.24 | CSS 벤더 프리픽스 |
| `eslint` | ^9.39.2 | 린터 |
| `eslint-config-next` | ^16.2.1 | Next.js ESLint 규칙 |
| `@eslint/js` | ^9.39.2 | ESLint JS 규칙 |
| `typescript-eslint` | ^8.46.3 | TypeScript ESLint |
| `eslint-plugin-react-hooks` | ^7.0.1 | React Hooks 린트 규칙 |
| `eslint-plugin-storybook` | ^10.3.3 | Storybook 린트 규칙 |
| `globals` | ^16.5.0 | ESLint 글로벌 변수 정의 |
| `prettier` | ^3.8.1 | 코드 포매터 |
| `husky` | ^9.1.7 | Git hooks |
| `lint-staged` | ^16.2.7 | staged 파일 린트 |
| `@types/node` | ^24.10.0 | Node.js 타입 정의 |
| `@types/react` | ^19.2.14 | React 타입 정의 |
| `@types/react-dom` | ^19.2.2 | React DOM 타입 정의 |
| `storybook` | ^10.3.3 | Storybook CLI |
| `@storybook/nextjs` | ^10.3.3 | Next.js 기반 Storybook 프레임워크 |
| `@storybook/addon-a11y` | ^10.3.3 | 접근성 애드온 |
| `@storybook/addon-docs` | ^10.3.3 | 문서화 애드온 |
| `@chromatic-com/storybook` | ^5.0.1 | Chromatic 연동 |

---

## 현재 스택 상태

### 앱 실행/배포

- 앱 실행 기준은 `Next.js App Router`다.
- `pnpm dev`는 `next dev`를 사용한다.
- `pnpm build`는 정적 산출물 배포를 전제로 `next build --webpack`을 사용한다.
- `pnpm preview`, `pnpm start`는 `out/` 산출물을 정적 서버로 확인하는 용도다.
- Firebase Hosting은 `out/` 디렉터리를 직접 배포한다.

### 렌더링 전략

- 공개 SEO 페이지: `SSG` 우선
- 내부 기능 페이지: `CSR` 우선
- `SSR`은 현재 기본 전략이 아님
- `ISR`은 공지사항 계열만 추후 검토 가능

### Storybook

- Storybook 프레임워크는 `@storybook/nextjs`로 전환 완료했다.
- 핵심 패키지 버전은 모두 `10.3.3`으로 정렬되어 있다.
- 스토리 타입 import와 설정도 현재 기준에 맞게 정리되어 있다.

### 도입 방향

- 폼: `react-hook-form + zod`
- 전역 클라이언트 상태: `zustand`
- 단, 위 항목은 설계 기준이며 실제 도입은 화면 구현 시점에 맞춰 진행한다.

---

## 최근 변경 이력

### 2026-04-04 — Firebase Hosting static export 정리

- `next.config.ts`에 `output: "export"` 적용
- Firebase Hosting public 디렉터리를 `out/`으로 전환
- `/index.html` SPA rewrite 제거
- `public/index.html` fallback 제거
- `pnpm preview`, `pnpm start`를 정적 산출물 확인 기준으로 정리
- `src/app/index.tsx`, `src/app/index.css` 레거시 App 엔트리 제거

### 2026-04-02 — Vite 제거 및 Storybook Next 전환

- `vite`, `vitest`, `playwright`, `@storybook/react-vite`, `@storybook/addon-vitest`, `@vitejs/plugin-react` 제거
- `eslint-plugin-react-refresh` 제거
- Storybook을 `@storybook/nextjs` 기준으로 전환
- Storybook 핵심 패키지 버전을 `10.3.3`으로 정렬

### 2026-04-01 — Next.js 전환 설계 문서화

- Next.js App Router 기준 명확화
- 페이지 인벤토리 및 SEO/CSR 분류 기준 정리
- `react-hook-form + zod + zustand` 채택 방향 문서화

### 2026-03-29 — Next.js 도입

| 패키지 | 이전 버전 | 이후 버전 | 분류 |
|---|---|---|---|
| `next` | - | ^16.2.1 | 기능 추가 |
| `eslint-config-next` | - | ^16.2.1 | 기능 추가 |

### 2026-03-29 — Issue #78

| 패키지 | 버전 | 분류 |
|---|---|---|
| `@tiptap/react` | 3.21.0 | 신규 |
| `@tiptap/pm` | 3.21.0 | 신규 |
| `@tiptap/starter-kit` | 3.21.0 | 신규 |
| `tiptap-extension-global-drag-handle` | 0.1.18 | 신규 |
| `tiptap-extension-auto-joiner` | 0.1.3 | 신규 |

### 2026-03-19 — 운영 정책 변경

- `.github/dependabot.yml` 제거
- Dependabot 자동 버전 PR 비활성화
- 의존성 업데이트를 수동 관리 기준으로 일원화

### 2026-02-22 — PR #31

| 패키지 | 이전 버전 | 이후 버전 | 분류 |
|---|---|---|---|
| `react` | 19.2.3 | 19.2.4 | 보안 |
| `react-dom` | 19.2.3 | 19.2.4 | 버그픽스 |
| `@types/react` | 19.2.6 | 19.2.14 | 타입 업데이트 |
| `@eslint/js` | 9.39.1 | 9.39.2 | 버그픽스 |
| `lint-staged` | 16.2.6 | 16.2.7 | 버그픽스 |
| `playwright` | 1.57.0 | 1.58.2 | 기능 개선 |
| `tailwindcss` | 4.1.18 | 4.2.0 | 기능 추가 |
| `autoprefixer` | 10.4.23 | 10.4.24 | 버그픽스 |
| `@chromatic-com/storybook` | 5.0.0 | 5.0.1 | 버그픽스 |
| `prettier` | 3.6.2 | 3.8.1 | 기능 개선 |
| `firebase` | 12.8.0 | 12.9.0 | 보안 |

반려:

| 패키지 | 제안 버전 | 반려 사유 |
|---|---|---|
| `@types/node` | 24.10.1 → 25.3.0 | 로컬 Node.js 환경(v20)과 불일치 |

---

## 주의사항

### `@types/node` 버전 불일치

- 현재 로컬 Node.js 환경은 v20이다.
- 하지만 `@types/node`는 24.x를 사용 중이다.
- 당장 문제는 없지만 Node 정책 정리 후 맞춰보는 것이 좋다.

### `tailwindcss` 4.2.0 deprecated 유틸리티

- `start-*`, `end-*` 유틸리티는 추후 제거 가능성이 있다.
- 신규 작업에서는 대체 유틸리티 사용을 우선 검토한다.

### `minimatch` ReDoS 취약점

- ESLint devDependency 체인에 걸린 트랜지티브 이슈다.
- 현재 상위 패키지 호환 범위에서 즉시 해결이 어려워 추적만 유지한다.

---

## 다음 검토 예정

| 항목 | 내용 |
|---|---|
| Node.js 버전 정책 | v20 유지 또는 v22 LTS 업그레이드 결정, `.nvmrc` 및 CI 버전 명시 |
| `@types/node` 정리 | Node.js 정책 확정 후 맞춰서 업데이트 |
| Chromatic 운영 여부 | PR 단위 UI 스냅샷 비교 도입 검토 |
| Firestore 보안 규칙 | `allow read, write: if true` 제거 및 인증 기반 규칙 정리 |

---

## 문서 갱신 규칙

- `package.json` 의존성이 바뀌면 이 문서도 함께 갱신한다.
- 구조 전환이나 배포 기준이 바뀌면 "현재 스택 상태"를 먼저 갱신한다.
- 이미 끝난 작업은 "진행 중"처럼 남겨두지 않는다.
