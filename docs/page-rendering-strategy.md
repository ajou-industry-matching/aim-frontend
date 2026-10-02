# 페이지 렌더링 전략 정리

이 문서는 AIM 프론트엔드의 페이지별 렌더링 기준을 정리한다.

## 0. 전제

`next.config.ts`가 `output: "export"`다. 이 제약이 아래 모든 기준을 결정한다.

- **`SSR`과 `ISR`은 사용할 수 없다.** 빌드 시점에 모든 라우트가 정적 HTML로 떨어지고, 이후 서버 렌더링 단계가 없다.
- 따라서 모든 페이지는 정적으로 프리렌더된다. 실제 구분은 **본문 데이터를 빌드 시점에 넣는지, 브라우저에서 채우는지**다.
  - 정적 콘텐츠(빌드 시 확정): 이 문서에서 `SSG`로 표기한다.
  - 클라이언트 fetch(브라우저에서 API 호출): `CSR`로 표기한다.
- **동적 세그먼트(`/notice/[id]` 같은 경로)는 쓰지 않는다.** `generateStaticParams`로 ID를 전부 미리 열거해야 하고, 목록에 없는 ID는 404가 된다. 대신 쿼리 파라미터(`/notice/detail?id=`) 방식을 쓴다.
- `Firebase Hosting` 유지가 우선 조건이다. `/api/**`는 `firebase.json` rewrite로 Cloud Run 백엔드에 전달한다.

## 1. 확정된 운영 원칙

### 1.1 정적 콘텐츠 페이지 (`SSG`)

본문이 빌드 시점에 확정되는 페이지다. 콘텐츠가 HTML에 담겨 검색 노출에 쓰인다.

- `/about` 소개 페이지
- `/privacy`, `/terms`, `/sitemap` 정책·안내 페이지

### 1.2 데이터 페이지 (`CSR`)

백엔드 API로 본문을 채우는 페이지다. 정적 export라 빌드 시점에 데이터를 넣을 수 없어 전부 클라이언트 fetch로 구현한다.

- 공개: `/home`, `/notice`, `/notice/detail`, `/portfolio`, `/portfolio/detail`
- 비공개: `/profile`, `/portfolio/create`, `/portfolio/edit`, `/admin` 계열

정적 프리렌더 HTML에는 히어로 카피나 섹션 제목 같은 정적 골격만 남는다. 목록·상세 콘텐츠는 검색 노출 대상이 되지 않는다는 점을 감수한 구성이다.

### 1.3 인증·권한이 걸린 페이지

- 서버 미들웨어를 쓸 수 없으므로 화면 진입 가드는 클라이언트에서 한다. `/admin` 레이아웃이 관리자 권한을 확인한 뒤 자식을 렌더하는 방식이다.
- 클라이언트 가드는 **UI 노출 방지 목적**이고, 실제 권한 검증은 백엔드가 담당한다.

## 2. 페이지 유형별 기준표

현재 구현된 라우트 전체를 기준으로 한다. `output: "export"`라 모든 라우트가 정적으로 프리렌더되므로, 아래 "기본 전략"은 **본문 데이터를 어디서 채우는지**를 뜻한다.

| 페이지 유형 | 경로 | 공개 여부 | 기본 전략 | 비고 |
| --- | --- | --- | --- | --- |
| 진입 분기 페이지 | `/` | 공개 | CSR 리다이렉트 | 인증 상태에 따라 `/home` 또는 `/login`으로 분기 |
| 인증 진입 페이지 | `/login` | 공개 | CSR | 상호작용 중심, SEO 우선도 낮음. 구글 로그인과 기업(이메일/비밀번호) 로그인 |
| 정적 공개 페이지 | `/about` | 공개 | SSG | 소개/안내형 콘텐츠 |
| 정책·안내 페이지 | `/privacy`, `/terms`, `/sitemap` | 공개 | SSG | 공용 `PolicyPage`로 외부 문서 링크만 노출 |
| 홈 | `/home` | 공개 | CSR | 신규·섹션별·공지 3개 영역을 클라이언트에서 병렬 fetch (`home-store`) |
| 공지 목록 | `/notice` | 공개 | CSR | 클라이언트 fetch + `useSearchParams`(페이지네이션) |
| 공지 상세 | `/notice/detail?id=` | 공개 | CSR | 쿼리 파라미터 방식. 동적 `[id]`는 정적 export에서 404가 나므로 쓰지 않는다 |
| 포트폴리오 목록 | `/portfolio` | 공개 | CSR | 클라이언트 fetch + `useSearchParams`(검색어·필터·정렬) |
| 포트폴리오 상세 | `/portfolio/detail?id=` | 공개 | CSR | 쿼리 파라미터 방식 |
| 사용자 내부 페이지 | `/profile` | 비공개 | CSR | 인증 확정 후 개인화 API 호출 |
| 작성/편집 페이지 | `/portfolio/create`, `/portfolio/edit` | 비공개 | CSR | 폼 상태 중심. 편집은 소유자 확인 후 진입 |
| 관리자 페이지 | `/admin`, `/admin/notices`, `/admin/notices/edit` | 비공개(관리자) | CSR | `/admin` 레이아웃에서 관리자 권한 가드 후 렌더 |

`/notice/create`는 관리자 전용 화면으로 `/admin` 하위로 이관하는 작업이 진행 중이다(#157). 이관이 끝나면 위 표의 관리자 페이지 행에 포함된다.

## 3. 도구 사용 기준

### 3.1 폼

- 실제 인증/회원가입 화면 구현 시 `react-hook-form + zod`를 도입한다.
- 모든 폼 화면에 선도입하지 않고, 실제 폼 라우트가 생길 때부터 적용한다.

### 3.2 전역 상태

- `zustand`는 전역 클라이언트 상태에 도입되어 사용 중이다(예: 홈 데이터 패칭 `home-store.ts`).
- 여러 컴포넌트/페이지에서 공유되는 클라이언트 상태가 생길 때만 최소 범위로 도입한다.

예상 후보:

- 모달 열림 상태
- 대시보드 필터 상태
- 다단계 작성 흐름
- 사용자별 UI 설정 상태

## 4. Firebase Hosting 관련 메모

- Firebase Hosting은 `out/` 정적 산출물을 직접 배포한다.
- `/api/**`는 `firebase.json`의 rewrite로 Cloud Run 백엔드(`aim-be-prod`)에 전달된다. 백엔드 리전을 옮기면 이 rewrite도 함께 바꿔야 API가 끊기지 않는다.
- 현재 구조는 "Next.js 앱 + Firebase Hosting(static export) + 클라이언트 fetch"로 이해한다.

## 5. 후속 작업

1. 정적 콘텐츠 페이지(`/about`)의 실제 소개 내용을 채운다. 현재는 준비 중 안내만 있다.
2. 목록·상세가 검색 노출되어야 한다면 `output: "export"` 자체를 재검토해야 한다. 이 제약 아래에서는 `ISR`이나 서버 렌더링으로 해결할 수 없다.
3. 폼 라우트에 `react-hook-form + zod` 도입을 검토한다. 현재 작성/수정 화면은 로컬 상태로 구현돼 있다.
4. `zustand`는 이미 도입되어 사용 중이다(`src/screens/home/home-store.ts`). 새 전역 상태는 최소 범위로 추가한다.
