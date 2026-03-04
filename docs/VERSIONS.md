# 의존성 버전 관리

이 문서는 프로젝트의 주요 의존성 버전 현황과 업데이트 이력을 관리합니다.

---

## 현재 버전 현황

### 런타임 환경

| 항목 | 버전 | 비고 |
|---|---|---|
| Node.js | 20.x | ⚠️ LTS(v22) 업그레이드 검토 필요 |
| pnpm | - | 패키지 매니저 |

### 프로덕션 의존성

| 패키지 | 버전 | 설명 |
|---|---|---|
| `react` | 19.2.4 | UI 프레임워크 |
| `react-dom` | 19.2.4 | React DOM 렌더러 |
| `firebase` | 12.9.0 | BaaS (Hosting, Firestore, Storage) |

### 개발 의존성

| 패키지 | 버전 | 설명 |
|---|---|---|
| `typescript` | ~5.9.3 | 타입스크립트 컴파일러 |
| `vite` | ^7.2.2 | 빌드 도구 |
| `tailwindcss` | 4.2.0 | CSS 프레임워크 |
| `autoprefixer` | 10.4.24 | CSS 벤더 프리픽스 |
| `postcss` | ^8.5.6 | CSS 후처리기 |
| `eslint` | ^9.39.1 | 린터 |
| `@eslint/js` | 9.39.2 | ESLint JS 규칙 |
| `typescript-eslint` | ^8.46.3 | TypeScript ESLint |
| `eslint-plugin-react-hooks` | ^7.0.1 | React Hooks 린트 규칙 |
| `eslint-plugin-react-refresh` | ^0.4.24 | React Refresh 린트 규칙 |
| `prettier` | 3.8.1 | 코드 포매터 |
| `lint-staged` | 16.2.7 | staged 파일 린트 |
| `husky` | ^9.1.7 | Git hooks |
| `@types/react` | 19.2.14 | React 타입 정의 |
| `@types/react-dom` | ^19.2.2 | React DOM 타입 정의 |
| `@types/node` | 24.10.1 | Node.js 타입 정의 |
| `playwright` | 1.58.2 | 브라우저 자동화 (Vitest 엔진) |
| `vitest` | ^4.0.17 | 테스트 프레임워크 |
| `@vitest/browser-playwright` | ^4.0.17 | Vitest 브라우저 테스트 |
| `@vitest/coverage-v8` | ^4.0.17 | 커버리지 |
| `storybook` | ^10.1.11 | UI 컴포넌트 개발 환경 |
| `@storybook/react-vite` | ^10.1.11 | Storybook React+Vite 통합 |
| `@storybook/addon-vitest` | ^10.1.11 | Storybook Vitest 애드온 |
| `@storybook/addon-a11y` | ^10.1.11 | 접근성 검사 애드온 |
| `@storybook/addon-docs` | ^10.1.11 | 문서화 애드온 |
| `eslint-plugin-storybook` | ^10.1.11 | Storybook 린트 규칙 |
| `@chromatic-com/storybook` | 5.0.1 | Chromatic 비주얼 테스트 애드온 |
| `@vitejs/plugin-react` | ^5.1.0 | Vite React 플러그인 |

---

## 업데이트 이력

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

---

## 🗓️ 다음 검토 예정

| 항목 | 내용 |
|---|---|
| Node.js 버전 정책 | v20 → v22 LTS 업그레이드 검토, `.nvmrc` 및 CI 버전 명시 |
| `@types/node` | Node.js 버전 정책 확정 후 맞춰서 업데이트 |
| Chromatic 도입 | PR마다 UI 스냅샷 자동 비교 도입 검토 (SSR/SEO 개선 안건과 함께) |
| Firestore 보안 규칙 | `allow read, write: if true` → 적절한 인증 기반 규칙으로 수정 필요 |