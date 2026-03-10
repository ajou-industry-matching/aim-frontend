# AIM AJOU — 프론트엔드 개발 가이드

## 목차

1. [개발 환경 설정](#개발-환경-설정)
2. [프로젝트 구조](#프로젝트-구조)
3. [아키텍처](#아키텍처)
4. [개발 워크플로우](#개발-워크플로우)
5. [코드 컨벤션](#코드-컨벤션)
6. [컴포넌트 개발 가이드](#컴포넌트-개발-가이드)
7. [상태 관리 및 데이터 패칭](#상태-관리-및-데이터-패칭)
8. [API 호출 가이드](#api-호출-가이드)
9. [의존성 관리](#의존성-관리)
10. [CI/CD](#cicd)

---

## 개발 환경 설정

### 사전 요구사항

- **Node.js**: v20.x (v22 LTS 업그레이드 검토 중 — 현재 v20 사용)
- **pnpm**: 패키지 매니저 (의존성 관리를 위해 npm/yarn 사용 금지)

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# Storybook 실행 (포트 6006)
pnpm storybook

# 프로덕션 빌드
pnpm build

# 린트 검사
pnpm lint
```

### 환경 변수 설정 (.env)

Firebase 연동을 위해 `.env` 파일 설정이 필요합니다.

> `.env` 파일은 절대 GitHub에 커밋하지 마세요. `.gitignore`에 등록되어 있습니다.

환경 변수 값은 **팀 노션**을 참고해서 프로젝트 루트에 `.env` 파일을 생성하세요.

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 프로젝트 구조

```
aim-frontend/
 ├─ .storybook/             # Storybook 설정 (main.ts, preview.ts)
 ├─ public/
 ├─ src/
 │   ├─ app/                # 애플리케이션 초기화
 │   │   ├─ providers/      # Context providers
 │   │   ├─ router/         # 라우팅 설정
 │   │   ├─ index.tsx       # App 컴포넌트
 │   │   └─ index.css       # 전역 스타일
 │   │
 │   ├─ pages/              # 페이지 레이어
 │   ├─ widgets/            # 위젯 레이어 (큰 UI 블록)
 │   ├─ features/           # 기능 레이어
 │   ├─ entities/           # 엔티티 레이어
 │   └─ shared/             # 공유 레이어
 │       ├─ ui/             # 재사용 가능한 UI 컴포넌트
 │       ├─ assets/         # 전역 에셋 (images, icons, fonts)
 │       ├─ config/         # 설정 (firebase.ts)
 │       ├─ api/            # API 클라이언트
 │       ├─ lib/            # 유틸리티 함수
 │       └─ types/          # 공통 타입 정의
 │
 ├─ docs/                   # 문서
 │   └─ VERSIONS.md         # 의존성 버전 관리
 ├─ .github/workflows/      # PR Preview & Live Deploy CI/CD
 ├─ .husky/                 # pre-commit hooks
 ├─ firebase.json
 ├─ firestore.rules
 ├─ storage.rules
 ├─ eslint.config.js
 ├─ prettier.config.cjs
 ├─ tailwind.config.js
 └─ tsconfig.json
```

---

## 아키텍처

### FSD (Feature-Sliced Design)

레이어 의존 방향은 **단방향**입니다. 하위 레이어는 상위 레이어를 import할 수 없습니다.

```
app → pages → widgets → features → entities → shared
```

- `@/` alias를 사용해 절대 경로로 import
- 각 슬라이스는 `index.ts`(public API)를 통해서만 export

```ts
// 올바른 import
import { Button } from '@/shared/ui/button'
import { AuthFeature } from '@/features/auth'

// 잘못된 import (하위에서 상위 참조 금지)
// shared에서 features import 불가
```

### 인프라 구조

현재는 Vite 기반 SPA이며, Next.js App Router 기반 SSR 전환이 검토 중입니다.

```
브라우저
  └─ Firebase Hosting (정적 파일 서빙)
       └─ Spring 백엔드 API 호출 (Oracle Cloud Run)
            └─ MySQL (Oracle Server)

Firebase: Hosting, Firestore, Storage, Auth
```

---

## 개발 워크플로우

### 1. 이슈 생성

개발 시작 전 반드시 이슈를 먼저 생성합니다. 이슈 템플릿에 맞춰 작성하세요.

### 2. 브랜치 생성

브랜치명은 자유롭게 지어도 됩니다. 피처 단위로 브랜치를 따서 작업합니다.

```bash
git checkout -b feat/button-component
git checkout -b fix/header-layout
```

### 3. 개발 및 커밋

커밋 시 Husky + lint-staged가 자동으로 실행됩니다.

- `eslint --fix`
- `prettier --write`

포맷팅되지 않은 코드는 커밋이 불가합니다.

### 4. PR 생성

`dev` 브랜치로 PR을 올립니다. PR 템플릿에 맞춰 작성하세요.

- **1명 이상의 리뷰어 승인** 후 머지 가능
- 리뷰어는 주로 **컨벤션 준수 여부**를 중점적으로 확인합니다

### 5. 코드 리뷰

- **CodeRabbit**: 푸시 단위로 자동 리뷰를 달아줍니다. 지적 사항은 반드시 확인하세요.
- **GitHub Copilot**: 필요할 때 직접 요청해서 사용합니다.

---

## 코드 컨벤션

기본적으로 **Airbnb 스타일 가이드**를 따릅니다.

### 네이밍

| 대상 | 규칙 | 예시 |
|---|---|---|
| 변수 / 함수 | camelCase | `isLoading`, `getVariantClasses` |
| 타입 / 컴포넌트 / 인터페이스 | PascalCase | `ButtonProps`, `ButtonVariant`, `Spinner` |
| 불린 | `is/has/should/can` 접두사 | `isIconOnly`, `hasError` |
| 유니언 상수 | literal union | `type ButtonVariant = "primary" \| "secondary"` |
| 파일 / 폴더 | 케밥 케이스 | `button.tsx`, `user-card.tsx`, `use-auth.ts` |
| 스토리 파일 | `.stories.tsx` | `button.stories.tsx` |
| 테스트 파일 | `.test.ts(x)` / `.spec.ts(x)` | `button.test.tsx` |

### 타입

```ts
// Enum 대신 literal union + as const 사용
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"

const BUTTON_VARIANTS = ["primary", "secondary", "ghost", "danger"] as const
type ButtonVariant = typeof BUTTON_VARIANTS[number]

// Enum 사용 금지
enum ButtonVariant { Primary = "primary" }
```

- 함수 반환 타입 명시 (특히 public API, hooks)
- `interface`보다 `type` 선호 (단, 확장이 필요한 경우 `interface` 사용 가능)

### 임포트 순서

```ts
// 1. 외부 라이브러리
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. 내부 alias (FSD 레이어 순서)
import { apiClient } from '@/shared/api'
import { UserEntity } from '@/entities/user'
import { AuthFeature } from '@/features/auth'

// 3. 상대 경로
import { getButtonClasses } from './button.utils'
import type { ButtonProps } from './button.types'
```

---

## 컴포넌트 개발 가이드

### 스타일 클래스 패턴

```ts
// 토큰 모음: *Classes
const baseClasses = "inline-flex items-center font-medium transition-colors"
const sizeClasses = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-base" }
const variantClasses = {
  primary: "bg-[color:var(--color-primary-800,#004a9c)] text-white",
  secondary: "bg-transparent border border-[color:var(--color-primary-800,#004a9c)]",
}

// 조립 함수: get*Classes()
const getButtonClasses = (variant: ButtonVariant, size: ButtonSize) => {
  return [baseClasses, sizeClasses[size], variantClasses[variant]].join(" ")
}

// 최종 클래스 변수: 명사형
const buttonClasses = getButtonClasses(variant, size)
```

- Tailwind + CSS 변수는 fallback 포함 권장: `bg-[color:var(--color-primary-800,#004a9c)]`
- 전역 스타일 최소화 — 전역 스타일은 Storybook과 앱 양쪽에서 동일한 진입점 CSS를 사용

### Props 패턴

```ts
// Props 인터페이스: ComponentNameProps
interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean       // 불린: is/has/should/can 접두사
  onClick?: () => void      // 핸들러: on* 접두사
  children: React.ReactNode
}
```

### Storybook 작성 (필수)

컴포넌트 개발이 완료되면 반드시 Storybook 스토리를 함께 작성해야 합니다.

```ts
// button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Shared/UI/Button',
  component: Button,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: '버튼' },
}

export const Loading: Story = {
  args: { variant: 'primary', isLoading: true, children: '로딩 중' },
}
```

---

## 상태 관리 및 데이터 패칭

| 용도 | 도구 |
|---|---|
| 서버 상태 (API 데이터) | **React Query** (`@tanstack/react-query`) |
| 클라이언트 전역 상태 | **Zustand** |
| 라우팅 | **TanStack Router** |

```ts
// React Query — 서버 데이터 패칭
const { data, isLoading } = useQuery({
  queryKey: ['portfolios'],
  queryFn: () => apiClient.get('/portfolios'),
})

// Zustand — 클라이언트 전역 상태
const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

---

## API 호출 가이드

모든 API 요청은 `src/shared/api`의 Axios 인스턴스를 사용합니다.

- 자동 Authorization 헤더 삽입
- 에러 처리 인터셉터
- Response 타입 안전성 확보

### Next.js 도입 시 (검토 중)

Next.js App Router 전환 후에는 보안을 위해 **서버 컴포넌트에서 API를 호출**합니다. 클라이언트에서 백엔드를 직접 호출하는 것을 최소화하고, 인터랙션이 필요한 컴포넌트에만 `"use client"`를 선언합니다.

```tsx
// 서버 컴포넌트 — 데이터 패칭
async function PortfolioPage() {
  const data = await fetch('https://api/portfolios').then(r => r.json())
  return <PortfolioList data={data} />
}

// 클라이언트 컴포넌트 — 인터랙션만
"use client"
function LikeButton() {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(true)}>좋아요</button>
}
```

---

## 의존성 관리

패키지 매니저는 **pnpm**만 사용합니다.

```bash
# 패키지 추가
pnpm add [패키지명]
pnpm add -D [패키지명]   # 개발 의존성

# 패키지 제거
pnpm remove [패키지명]
```

### VERSIONS.md 갱신 규칙

의존성을 추가하거나 업데이트할 경우 반드시 `docs/VERSIONS.md`를 함께 업데이트합니다.

- 현재 버전 현황 테이블 갱신
- 업데이트 이력에 날짜 및 변경 내역 추가
- 반려한 항목이 있으면 반려 사유도 기록

---

## CI/CD

### PR 생성 시

- 빌드 검사
- ESLint 검사
- Firebase Preview URL 자동 생성

### `main` 머지 시

- Firebase Hosting Live 자동 배포