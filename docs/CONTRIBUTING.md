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

# 개발 서버 실행 (Next.js)
pnpm dev

# Storybook 실행 (포트 6006)
pnpm storybook

# 프로덕션 정적 빌드
pnpm build

# 정적 산출물 미리보기
pnpm preview

# 린트 검사
pnpm lint
```

### 이번 구조 변경으로 달라진 점

이전에는 "Vite 기반 SPA + 일부 Next 파일"처럼 보일 수 있었지만, 현재는 아래 기준으로 이해하면 됩니다.

- 앱 개발 기준은 `Next.js App Router`다.
- Firebase Hosting은 유지하되, 배포는 `out/` 정적 산출물을 기준으로 한다.
- 공개 페이지는 `SSG`, 로그인 이후 내부 페이지는 `CSR`을 기본 전략으로 삼는다.
- `src/app`는 라우팅과 레이아웃을 담당하고, 실제 화면 구현은 `src/screens`에 둔다.
- Vite 앱 엔트리(`src/main.tsx`, `index.html`)와 레거시 App 엔트리(`src/app/index.tsx`)는 더 이상 사용하지 않는다.

새로 합류한 팀원은 "Next.js로 실행하지만 모든 페이지를 SSR로 만드는 프로젝트는 아니다"라고 이해하면 가장 덜 헷갈린다.

### 환경 변수 설정 (.env)

Firebase 연동을 위해 `.env` 파일 설정이 필요합니다.

> `.env` 파일은 절대 GitHub에 커밋하지 마세요. `.gitignore`에 등록되어 있습니다.

환경 변수 값은 **팀 노션**을 참고해서 프로젝트 루트에 `.env.local` 파일을 생성하세요.

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 프로젝트 구조

```
aim-frontend/
 ├─ .storybook/             # Storybook 설정 (main.ts, preview.ts)
 ├─ public/
 ├─ src/
 │   ├─ app/                # Next.js App Router 엔트리
 │   │   ├─ (auth)/         # 인증 관련 route group
 │   │   │   └─ login/
 │   │   │       └─ page.tsx
 │   │   ├─ layout.tsx      # 루트 레이아웃
 │   │   ├─ page.tsx        # 기본 라우트
 │   │   └─ globals.css     # 전역 스타일 진입점
 │   │
 │   ├─ api/                # 백엔드/외부 API 클라이언트
 │   ├─ lib/                # 앱 유스케이스와 공통 로직
 │   ├─ screens/            # 화면 구현 (기존 pages 레이어 대체)
 │   └─ shared/             # 공유 레이어
 │       ├─ ui/             # 재사용 가능한 UI 컴포넌트
 │       ├─ assets/         # 전역 에셋 (images, icons, fonts)
 │       ├─ config/         # 설정 (firebase.ts)
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
 ├─ next.config.ts
 ├─ prettier.config.cjs
 ├─ tailwind.config.js
 ├─ out/                    # Next static export 산출물 (git ignore)
 └─ tsconfig.json
```

### 현재 실행 기준

- 앱 실행과 빌드는 `Next.js`를 기준으로 한다.
- 라우팅 엔트리는 `src/app`이며, 새 페이지는 `src/app/**/page.tsx`에 추가한다.
- 현재 인증 라우트는 `src/app/(auth)` route group 기준으로 관리한다.
- 전역 스타일 진입점은 `src/app/globals.css`이며, 디자인 토큰과 베이스 스타일은 `src/index.css`를 import해서 사용한다.
- Firebase Hosting 유지가 우선 조건이며, 공개 SEO 페이지는 `SSG`를 기본 전략으로 삼는다.
- `src/main.tsx`, `index.html`, `vite.config.ts`, `src/firebase.js`는 제거되었다.
- `src/app/index.tsx`, `src/app/index.css` 같은 레거시 App 엔트리 파일은 제거했다.
- Storybook은 `@storybook/nextjs` 기반으로 동작한다.
- Firebase Hosting은 `out/` 정적 산출물을 직접 배포한다.

### 파일을 어디에 두면 되는가

작업 전 아래 기준으로 파일 위치를 먼저 정합니다.

- 새 URL 경로 추가:
  - `src/app/**/page.tsx`
- 라우트 공통 레이아웃/metadata:
  - `src/app/**/layout.tsx`
- 실제 화면 구현:
  - `src/screens/**`
- 백엔드/외부 API 호출:
  - `src/api/**`
- Firebase 로그인 흐름, 세션 생성, 화면과 API 사이의 유스케이스:
  - `src/lib/**`
- 재사용 UI:
  - `src/shared/ui/**`
- 전역 스타일 진입:
  - `src/app/globals.css`
- 디자인 토큰/베이스 스타일:
  - `src/index.css`

현재 기준 예시:

- `/login` 라우트 파일:
  - `src/app/(auth)/login/page.tsx`
- 로그인 화면 구현:
  - `src/screens/login/index.tsx`

---

## 아키텍처

### 레이어 기준

현재 구조는 FSD를 엄격히 적용하기보다, Next.js App Router에 맞춘 컴팩트한 레이어 구조를 사용합니다. 의존 방향은 **단방향**입니다.

```
app → screens → lib → api → shared
```

- `@/` alias를 사용해 절대 경로로 import
- `src/app`은 URL, layout, metadata 같은 라우팅 책임만 갖는다.
- `src/screens`는 라우트가 렌더링하는 화면 조합을 담당한다.
- `src/lib`는 로그인, 세션 생성처럼 화면과 API 사이의 앱 로직을 담당한다.
- `src/api`는 fetch, 요청/응답 타입, 외부 API 호출만 담당한다.
- `src/shared`는 UI, config, asset처럼 도메인과 무관한 공통 자원만 둔다.

```ts
// 올바른 import
import { Button } from '@/shared/ui/button'
import { signInWithGoogle } from '@/lib/auth'
import { loginWithBackend } from '@/api/auth'

// 잘못된 import
// api에서 screens/lib import 금지
// shared에서 api/lib/screens import 금지
```

### 인프라 구조

현재 앱 실행 기준은 Next.js App Router이며, Vite 기반 앱 엔트리는 제거되었다. Firebase Hosting 유지가 우선 조건이므로, 공개 페이지는 `SSG` 중심으로 설계하고 `out/` 정적 산출물을 직접 배포한다.

```
브라우저
  └─ Next.js 앱
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

### 3-1. 구조 변경 시 체크리스트

Next.js 전환 작업이나 구조 변경이 포함되면 아래 항목을 함께 확인합니다.

- 새 라우트가 `src/app` 기준으로 추가되었는가
- 라우트 파일이 화면 구현까지 전부 떠안지 않고, 필요한 경우 `src/screens`를 조합하는가
- SEO 대상 페이지인지, CSR 유지 페이지인지 분류했는가
- 공개 SEO 페이지라면 `SSG` 가능한 구조인지 먼저 검토했는가
- `use client`가 꼭 필요한 곳에만 선언되었는가
- `NEXT_PUBLIC_*` 기준으로 환경 변수 사용이 정리되었는가
- `pnpm build` 시 `out/` 정적 산출물이 생성되는 구조인지 확인했는가
- `docs/VERSIONS.md`, 관련 가이드 문서가 함께 갱신되었는가

### 3-2. 자주 헷갈리는 포인트

- `CSR 페이지`라고 해서 Vite를 다시 쓰는 것은 아니다.
  - Next.js 안에서도 Client Component 기반으로 충분히 구현할 수 있다.
- `src/app/page.tsx`는 라우트 파일이고, `src/screens/**`는 화면 구현 파일이다.
  - 라우트 정의와 화면 구현을 분리하는 것이 현재 기준이다.
- `pnpm build` 결과물은 `.next`만 보는 것이 아니라 최종적으로 `out/` 배포를 염두에 둔다.
- `/`는 지금 정적 export 환경을 고려해 클라이언트에서 `/login`으로 이동한다.
  - 향후 공개 랜딩 페이지가 생기면 이 역할은 다시 바뀔 수 있다.
- 로컬에서 IP로 접속해 탭/클릭이 안 먹는 경우, 코드 문제가 아니라 `allowedDevOrigins` 문제일 수 있다.
  - 이 경우 `next.config.ts`를 먼저 확인한다.

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

// 2. 내부 alias (레이어 순서)
import { auth } from '@/shared/config/firebase'
import { loginWithBackend } from '@/api/auth'
import { signInWithGoogle } from '@/lib/auth'

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

### 화면 개발 패턴

현재 프로젝트에서는 "라우트 파일은 얇게, 화면 구현은 screens로" 가져가는 것을 권장합니다.

```tsx
// src/app/(auth)/login/page.tsx
import { LoginPage } from "@/screens"

export default function LoginRoute() {
  return <LoginPage />
}
```

```tsx
// src/screens/login/index.tsx
"use client"

export function LoginPage() {
  return <main>...</main>
}
```

권장 이유:

- 라우팅 구조와 화면 구현 책임이 분리된다.
- 같은 화면을 Storybook이나 다른 진입점에서 재사용하기 쉽다.
- 추후 `(public)`, `(dashboard)` route group 확장 시 일관성이 유지된다.

---

## 상태 관리 및 데이터 패칭

| 용도 | 도구 |
|---|---|
| 라우팅 | **Next.js App Router** |
| 정적 공개 페이지 생성 | **Next.js SSG / Server Component / `generateMetadata`** |
| 폼 상태 관리 | **react-hook-form** |
| 입력값 검증 | **zod** |
| 클라이언트 전역 상태 | **zustand** |
| 단순 로컬 상호작용 상태 | **React state** (`useState`, `useReducer`) |

```ts
// Server Component — 서버 데이터 패칭
async function PortfolioPage() {
  const data = await fetch("https://api/portfolios").then((response) => response.json())
  return <PortfolioList data={data} />
}

// Client Component — 상호작용 상태
"use client"

function LikeButton() {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(true)}>좋아요</button>
}
```

권장 원칙:

- 폼은 `react-hook-form + zod` 조합을 기본으로 사용한다.
- 여러 컴포넌트에서 공유되는 클라이언트 상태는 `zustand`를 사용한다.
- 공개 SEO 페이지는 가능한 한 `SSG`로 생성한다.
- 서버 데이터는 가능한 한 Server Component 또는 빌드 시점 fetch로 가져온다.
- 단순한 토글/탭/입력 표시 상태는 `useState`로 시작한다.

현재 합의된 적용 범위:

- `react-hook-form + zod`
  - 인증/회원가입 등 실제 폼 라우트 구현 시점부터 도입
- `zustand`
  - 모달, 필터, 다단계 작성 흐름처럼 "여러 컴포넌트에서 실제로 공유되는 상태"가 생길 때 최소 범위로 도입
- `ISR`
  - 현재는 공지사항 계열만 추후 검토 가능

---

## API 호출 가이드

API 클라이언트는 `src/api` 하위에 둔다. 백엔드 API, Google People API처럼 네트워크 요청 자체와 요청/응답 타입은 이 레이어에 모으고, 화면 흐름과 세션 생성 로직은 `src/lib`에서 조합한다.

권장 원칙:

- 서버 컴포넌트에서 우선적으로 데이터 패칭
- 인증 헤더/토큰 주입 로직 중앙화
- 에러 처리와 응답 파싱 로직 공통화
- 브라우저 전용 상호작용만 Client Component에서 처리
- `src/api`는 `src/screens`나 `src/lib`를 import하지 않는다.

### Next.js 기준 권장 방식

Firebase Hosting 유지 조건에서는 **공개 페이지를 빌드 시점에 생성할 수 있는지** 먼저 확인합니다. 클라이언트에서 백엔드를 직접 호출하는 경우는 사용자 입력, 이벤트 처리, 즉시 반응이 필요한 상호작용으로 제한합니다.

```tsx
// 서버 컴포넌트 — 데이터 패칭
async function PortfolioPage() {
  const data = await fetch("https://api/portfolios").then((response) => response.json())
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

### 배포 관점에서 기억할 점

- 현재 Hosting은 SPA용 `/index.html` rewrite가 아니라 `out/` 정적 산출물을 직접 배포한다.
- 따라서 공개 페이지 작업 시 "이 페이지가 정적으로 생성 가능한가?"를 먼저 확인해야 한다.
- 배포 이슈가 생기면 `firebase.json`, `next.config.ts`, `pnpm build` 결과를 함께 본다.
