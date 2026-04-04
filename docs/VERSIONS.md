# 의존성 버전 관리

이 문서는 프로젝트의 주요 의존성 버전 현황과 업데이트 이력을 관리합니다.

---

## 현재 버전 현황

### 런타임 환경

| 항목 | 버전 | 비고 |
|---|---|---|
| Node.js | 20.x | ⚠️ LTS(v22) 업그레이드 검토 필요 |
| pnpm | 10.20.0 | 패키지 매니저 |

### 프로덕션 의존성

| 패키지 | 버전 | 설명 |
|---|---|---|
| `react` | 19.2.4 | UI 프레임워크 |
| `react-dom` | 19.2.4 | React DOM 렌더러 |
| `next` | ^16.2.1 | App Router 기반 프레임워크 |
| `firebase` | 12.9.0 | BaaS (Hosting, Firestore, Storage) |

### 개발 의존성

| 패키지 | 버전 | 설명 |
|---|---|---|
| `typescript` | ~5.9.3 | 타입스크립트 컴파일러 |
| `tailwindcss` | 4.2.0 | CSS 프레임워크 |
| `autoprefixer` | 10.4.24 | CSS 벤더 프리픽스 |
| `postcss` | ^8.5.6 | CSS 후처리기 |
| `eslint` | ^9.39.2 | 린터 |
| `eslint-config-next` | ^16.2.1 | Next.js ESLint 규칙 |
| `@eslint/js` | 9.39.2 | ESLint JS 규칙 |
| `typescript-eslint` | ^8.46.3 | TypeScript ESLint |
| `eslint-plugin-react-hooks` | ^7.0.1 | React Hooks 린트 규칙 |
| `prettier` | 3.8.1 | 코드 포매터 |
| `lint-staged` | 16.2.7 | staged 파일 린트 |
| `husky` | ^9.1.7 | Git hooks |
| `@types/react` | 19.2.14 | React 타입 정의 |
| `@types/react-dom` | ^19.2.2 | React DOM 타입 정의 |
| `@types/node` | ^24.10.0 | Node.js 타입 정의 |
| `storybook` | ^10.3.3 | UI 컴포넌트 개발 환경 |
| `@storybook/nextjs` | ^10.3.3 | Next.js 기반 Storybook 프레임워크 |
| `@storybook/addon-a11y` | ^10.3.3 | 접근성 검사 애드온 |
| `@storybook/addon-docs` | ^10.3.3 | 문서화 애드온 |
| `eslint-plugin-storybook` | ^10.3.3 | Storybook 린트 규칙 |
| `@chromatic-com/storybook` | 5.0.1 | Chromatic 비주얼 테스트 애드온 |
| `@tailwindcss/postcss` | ^4.1.18 | Tailwind CSS PostCSS 플러그인 |
| `globals` | ^16.5.0 | ESLint 글로벌 변수 정의 |

---

## 현재 구조 기준 메모

- 앱 실행 기준은 `Next.js`이며, `build`는 정적 산출물 `out/`을 생성하고 `preview/start`는 이를 정적 서버로 확인하는 용도로 사용한다.
- Firebase Hosting 유지가 우선 조건이며, 공개 SEO 페이지는 `SSG 중심`으로 설계한다.
- Vite 직접 의존성은 제거되었고, Firebase Hosting은 `out/` 산출물을 직접 배포하는 구조로 정리되었다.

### Storybook 전환 메모

- Storybook 프레임워크는 `@storybook/react-vite`에서 `@storybook/nextjs`로 전환 완료했다.
- Storybook 관련 핵심 패키지 버전은 `10.3.3`으로 정렬되었다.
- 스토리 타입 import와 설정 파일도 `@storybook/nextjs` 기준으로 정리되었다.

### 도입 방향 메모

- 상태 관리/폼 처리의 채택 방향은 `react-hook-form + zod + zustand` 조합이다.
- 단, 이 항목들은 아직 설치 완료 기준이 아니라 구조 설계상 채택 방향으로 관리한다.
- 실제 의존성 추가 시 이 문서의 현재 버전 현황 테이블과 업데이트 이력을 함께 갱신한다.

### 2026-03-29 

**적용 내역**

| 패키지 | 이전 버전 | 이후 버전 | 분류 |
|---|---|---|---|
| `next` | - | ^16.2.1 | 기능 추가 |
| `eslint-config-next` | - | ^16.2.1 | 기능 추가 |

---

## 업데이트 이력

### 2026-04-01 — Next.js 전환 1단계 문서 정리

**적용 내역**

- 실행 기준을 `Next.js App Router`로 문서상 명확화
- `vite` 관련 의존성 설명을 "전환 잔존/Storybook 용도" 기준으로 정리
- `eslint`, `@types/node` 표기 버전을 `package.json` 기준으로 보정
- 구조 정리 대상 Vite 잔존 자산 목록 추가

### 2026-04-01 — Next.js 전환 2단계 설계 반영

**적용 내역**

- 페이지 인벤토리와 SEO/CSR 1차 분류 기준 문서화
- 상태 관리/폼 처리 채택 방향을 `react-hook-form + zod + zustand`로 정리
- 실제 설치 전까지는 "도입 방향"으로 관리한다는 기준 명시

### 2026-04-02 — Vite 제거 착수

**적용 내역**

- `vite`, `vitest`, `playwright`, `@storybook/react-vite`, `@storybook/addon-vitest`, `@vitejs/plugin-react` 직접 의존성 제거
- `eslint-plugin-react-refresh` 제거
- Storybook 프레임워크를 `@storybook/nextjs`로 전환 시작
- 런타임은 이미 Next.js 기준이며, 남아 있는 것은 레거시 파일과 Storybook 설정 정리임을 문서에 반영
- Storybook 관련 패키지 핵심 버전을 `10.3.3`으로 정렬

### 2026-04-04 — Firebase Hosting 정적 export 정리

**적용 내역**

- `next.config.ts`를 `output: "export"` 기준으로 조정
- Firebase Hosting public 디렉터리를 `out/`으로 변경
- `/index.html` SPA rewrite와 `public/index.html` fallback 의존 제거
- `pnpm preview`, `pnpm start`를 정적 산출물 미리보기 기준으로 조정
- `src/app/index.tsx`, `src/app/index.css` 레거시 App 엔트리 제거

### 2026-03-19 — 운영 정책 변경

**적용 내역**

- `.github/dependabot.yml` 제거
- Dependabot version update 자동 PR 비활성화
- 의존성 업데이트를 수동 관리 기준으로 일원화

### 2026-02-22 — PR #31

**적용 내역**

| 패키지 | 이전 버전 | 이후 버전 | 분류 |
|---|---|---|---|
| `react` | 19.2.3 | 19.2.4 | 보안 |
| `react-dom` | 19.2.3 | 19.2.4 | 버그픽스 (버전 불일치 수정) |
| `@types/react` | 19.2.6 | 19.2.14 | 타입 업데이트 |
| `@eslint/js` | 9.39.1 | 9.39.2 | 버그픽스 |
| `lint-staged` | 16.2.6 | 16.2.7 | 버그픽스 |
| `playwright` | 1.57.0 | 1.58.2 | 기능 개선 |
| `tailwindcss` | 4.1.18 | 4.2.0 | 기능 추가 |
| `autoprefixer` | 10.4.23 | 10.4.24 | 버그픽스 |
| `@chromatic-com/storybook` | 5.0.0 | 5.0.1 | 버그픽스 |
| `prettier` | 3.6.2 | 3.8.1 | 기능 개선 |
| `firebase` | 12.8.0 | 12.9.0 | 보안 |

**반려 내역**

| 패키지 | 제안 버전 | 반려 사유 |
|---|---|---|
| `@types/node` | 24.10.1 → 25.3.0 | 로컬 Node.js 환경(v20)과 불일치. Node.js 버전 정책 정리 후 재검토 필요. |

---

## ⚠️ 알려진 이슈 및 주의사항

### `tailwindcss` 4.2.0 — deprecated 유틸리티
- `start-*` / `end-*` → `inset-s-*` / `inset-e-*` 로 교체 권장
- 현재는 경고 수준이나 이후 버전에서 제거될 수 있음
- 컴포넌트 작업 시 신규 유틸리티 사용 권장

### `minimatch` ReDoS 취약점 (Dependabot Alert #3)
- 영향 범위: ESLint 계열 devDependency 체인 (트랜지티브)
- 조치 불가: 최신 호환 버전인 `3.1.2`가 이미 설치되어 있으며, 상위 패키지 업데이트 전까지 강제 업그레이드 불가
- 위험도: 낮음 — 사용자 입력을 glob 패턴으로 받는 코드 없음 (devDependency 전용)
- 대응: 상위 패키지(eslint 등)의 자연스러운 업데이트를 기다림

### `@types/node` 버전 불일치
- 현재 Node.js 환경: v20
- 현재 `@types/node`: 24.x → 환경보다 높음
- CI(`firebase-hosting-merge.yml`)에 Node.js 버전 미명시
- **다음 회의 안건**: Node.js 버전 정책 수립 후 일괄 정리 필요

## 🗓️ 다음 검토 예정

| 항목 | 내용 |
|---|---|
| Node.js 버전 정책 | v20 → v22 LTS 업그레이드 검토, `.nvmrc` 및 CI 버전 명시 |
| `@types/node` | Node.js 버전 정책 확정 후 맞춰서 업데이트 |
| Chromatic 도입 | PR마다 UI 스냅샷 자동 비교 도입 검토 (SSR/SEO 개선 안건과 함께) |
| Firestore 보안 규칙 | `allow read, write: if true` → 적절한 인증 기반 규칙으로 수정 필요 |
