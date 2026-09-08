# 인수인계 (Handover)

이 문서는 기존 담당자가 참여하지 않아도 프로젝트가 굴러가도록, 아키텍처·배포 운영·코드 리뷰 기준을 한곳에 정리한 것입니다. 마지막 두 섹션(**프론트엔드 컨벤션 체크리스트**, **자주 나는 실수**)은 실제 PR 리뷰에서 반복적으로 지적된 내용을 규칙으로 옮긴 것이라, 새 리뷰어가 그대로 체크리스트로 쓸 수 있습니다.

관련 문서: [CONTRIBUTING](./CONTRIBUTING.md), [페이지 렌더링 전략](./page-rendering-strategy.md), [의존성/버전](./VERSIONS.md).

---

## 1. 시스템 개요

- 저장소 3개
  - `aim-frontend` — Next.js(App Router) 웹앱. 배포는 정적 export(`out/`) 기반 Firebase Hosting.
  - `aim-backend` — Spring Boot(Java 17) API. Cloud Run(`aim-be-prod`)으로 배포.
  - `aim-crawler` — 소프트콘 크롤러(Python). 크롤링 결과를 백엔드 API로 적재.
- 데이터: 운영 DB는 Oracle Cloud MySQL `161.33.46.41:3306/aim` (테이블명 소문자 `posts`, `users` 등). Firebase는 인증(ID 토큰 검증)과 Storage(이미지/첨부)에 사용.
- 리전: **`asia-northeast3`로 통일**(Firestore·Artifact Registry·Cloud Run). 자세한 배경은 2절.

### 프론트 렌더링/배포 구조
- 앱 기준은 App Router지만 **모든 페이지를 SSR로 만드는 프로젝트가 아니다.** 배포는 `out/` 정적 산출물이고, 공개 페이지는 SSG, 로그인 이후 내부 페이지는 CSR이 기본 전략이다. (근거: [page-rendering-strategy.md](./page-rendering-strategy.md))
- `/api/**`는 Firebase Hosting rewrite로 Cloud Run(`aim-be-prod`)에 프록시된다. 그래서 프론트는 정적이면서 동적 API를 함께 쓴다. 프론트는 API URL을 직접 갖지 않고 상대경로 `/api`를 호출한다.

---

## 2. 마이그레이션 배경 (왜 이렇게 했는가)

### 2.1 Cloud Run 운영 리전 통일 (`us-central1` → `asia-northeast3`)
- 배경: 백엔드 Cloud Run은 `us-central1`이었으나 Firestore·Artifact Registry는 이미 `asia-northeast3`였다. 리전 불일치로 레이턴시·네트워크 비용·운영 혼선이 있었다.
- 조치: 백엔드 배포 workflow의 `CLOUD_RUN_REGION`, 배포 검증 스크립트의 리전 가드, Terraform 변수(`region`/`cloud_run_region`), 프론트 `firebase.json`의 `/api` rewrite 리전을 모두 `asia-northeast3`로 통일.
- **컷오버 순서(중요)**: Cloud Run v2는 location이 immutable이라 새 리전에 새 서비스가 생성된다. 반드시 (1) 백엔드를 `asia-northeast3`에 먼저 배포·헬스체크 → (2) 그다음 프론트 `firebase.json` rewrite 전환. 역순이면 `/api`가 존재하지 않는 리전으로 라우팅되어 전면 장애.
- **하마터면(교훈)**: 새 리전 서비스는 기본이 "인증 필요"라 `allow-unauthenticated` 없이 생성되면 Hosting rewrite가 호출하지 못해 `/api` 전체가 403이 된다. Cloud Run 서비스는 public invoke가 정상 구성이고(앱 인증은 Firebase 토큰으로 별도 수행), 배포 workflow가 `--allow-unauthenticated`를 붙여야 한다.

### 2.2 크롤링 데이터 파이프라인의 진화
- 초기: 크롤러(Python)가 크롤링 결과를 백엔드 `posts` 테이블에 pymysql로 직접 적재.
- 현재: 백엔드에 크롤링 전용 도메인/API(`/api/crawled-projects`, 엔티티 `CrawledProject`/`CrawledProjectMember`)가 생겼다. 크롤러가 이 API로 적재하고, 학생은 자신이 참여한(가입 이름+이메일 ↔ 크롤링 이름+이메일 대조) 프로젝트를 개인 페이지에서 보고 원클릭으로 포트폴리오(`Post`)로 가져온다.
- 남은 논의: 가져오기 중복 생성(멱등성)·visibility 강제(백엔드 이슈), 크롤러가 API를 부를 관리자 토큰 발급 방식(크롤러 이슈). 크롤링 데이터 페이지 UI는 디자인 확정 후 진행.

---

## 3. 배포 & 운영 런북

### 3.1 프론트엔드
- 브랜치 전략: 작업 PR은 **`dev`** 로 올린다. `main`은 릴리즈 브랜치이고, `dev → main`은 `[Release] dev → main` PR로 승격한다. (기본 브랜치도 `dev`)
- `main`에 머지되면 **프로덕션 자동 배포**(Firebase Hosting live, `firebase-hosting-merge.yml`). 그래서 리전·도메인처럼 되돌리기 어려운 변경은 배포 순서를 반드시 지킨다.
- 패키지 매니저는 **pnpm 전용**. `pnpm install` / `pnpm dev` / `pnpm build`(정적 export) / `pnpm lint`.
- `next-env.d.ts`는 Next가 자동 생성하는 파일이라 로컬 변경이 커밋에 섞이면 CI가 깨진다. 온보딩 시 `git update-index --skip-worktree next-env.d.ts`로 커밋에 안 올라오게 막는다. (5.9 참고)

### 3.2 백엔드
- 브랜치 전략: PR을 `main`으로 직접 올린다(프론트와 달리 dev 단계 없음). `main` push 시 CI(`ci.yml`)와 배포(`deploy-cloud-run.yml`)가 각각 실행된다.
- 운영 서비스 `aim-be-prod`는 **배포 workflow가 소유·생성**하며 Terraform state로 추적하지 않는다(Terraform은 WIF/프로젝트/SA/Secret 등 baseline만 관리, Cloud Run image drift는 무시). 그래서 workflow가 서비스를 먼저 만들어도 Terraform import가 강제되지 않는다.
- 리전은 `asia-northeast3`. 배포 스텝은 `--allow-unauthenticated`를 명시해야 Hosting rewrite가 호출 가능하다(2.1 교훈).
- 시크릿: DB 접속정보/비밀번호와 Firebase Admin SDK는 저장소·tfvars·state에 넣지 않는다. GitHub Actions Secret/Variable + GCP Secret Manager로 주입한다.
- 상세 설정 순서·실패 대응은 `aim-backend/docs/cicd-cloud-run.md` 참고.

### 3.3 크롤러
- 운영 DB(위 1절)와 크롤러 전용 시스템 유저 자동 생성 옵션을 사용. 시크릿은 GitHub Actions + GCP Secret Manager.
- API 적재로 전환 시 `BACKEND_API_BASE_URL` + `CRAWLER_API_TOKEN`(관리자 토큰)을 env로 주입. 토큰 발급 방식은 미확정(백엔드와 합의 필요).

---

## 4. 코드 리뷰 기준 (이 프로젝트에서 실제로 보는 것)

접근성 속성이나 디자인 픽셀을 게이트로 삼지 않는다. **동작 정확성**과 **과설계 방지(ponytail)** 를 우선하고, 그다음 계약 일치·에러 처리·컨벤션·스코프를 본다.

1. **실질 버그 · 동작 정확성 (최우선)**
   - 상태/이펙트 정확성: controlled 파생값(글자수 등)이 초기 `value`를 반영하는가, 폼이 id 변경 시 리마운트되는가, `setTimeout`/구독이 정리되는가, `maxVisible` 같은 입력이 클램프되는가, 썸네일 제거가 실제로 반영되는가.
   - 정적 export 함정: 서버 `searchParams` 페이지네이션·`no-store` fetch·동적 `[id]` 열거 누락으로 404/빌드 실패가 나지 않는가(5.5).
   - 백엔드 API 계약 일치: 파라미터명(`sortType`)·multipart 작성·존재하지 않는 응답 필드(`UserMeResponse.userId`, `PostDetailResponse.authorName`) 참조처럼 "조용히 틀리는" 부분(5.6).
   - 렌더링 버그: 클래스가 실제 DOM에 안 먹는 경우(예: `[&>svg]`인데 아이콘이 `span`으로 감싸짐), 엔드포인트 오용(`/api/posts/notices`는 최신 4건 전용인데 목록에 씀).
2. **과설계 방지 (ponytail — 핵심)**
   - 이미 있는 공용 컴포넌트/유틸을 재사용하고, 중복 로직을 만들지 않는다(과거: `Button` 재구현, `PortfolioList` 복제, `roleLabels` 3벌, `isRichTextEmpty` 2벌).
   - "없어도 되는 코드"를 덜어낸다: 단일 호출자만을 위한 전역 상태·추상화(예: 검색 전환 전역 스토어 100줄), 이미 직렬화된 값을 중복으로 넣은 의존성 배열, 불필요한 `displayName`, 한 줄로 될 걸 감싼 래퍼. **최소한으로 동작하는 쪽**을 택한다.
3. **에러 · 실패 처리**
   - `BackendApiError.message` 원문을 화면에 노출하지 않는다(내부/프록시 문구 유출). 고정 문구 + `console.error`.
   - 모든 실패를 `[]`로 삼켜 "데이터 없음"으로 위장하지 않는다. `EmptyState`(error) vs 로딩으로 구분.
   - mutation 성공 후 목록 캐시 무효화(`clearListCache()`).
4. **컨벤션 일관성** — 스타일/취향 차이는 비블로킹이되, 프로젝트 컨벤션(pnpm, `type`>`interface`, kebab-case, 배럴 이중 등록, 토큰 표기 등 5절) 위반은 일관성 차원에서 요청한다.
5. **스코프 규율**
   - PR 범위를 좁게 유지하고, 무관한 변경·실제처럼 보이는 목데이터 화면은 별도 PR로 뺀다.
   - 전역 컴포넌트 변경은 영향받는 사용처를 PR 본문에 표로 정리한다.
   - 비블로킹 개선/발견 버그는 follow-up 이슈로 분리한다.

- 봇: `@coderabbitai review`로 자동 리뷰를 돌리고, 지적은 코드 기준으로 검증해 유효한 것만 반영·나머지는 근거와 함께 리졸브한다.
- 머지는 리뷰어가 한다. 제목/라벨 컨벤션은 3절과 기존 라벨을 따른다.

---

## 5. 프론트엔드 컨벤션 체크리스트 (리뷰 반복 지적 기반)

새 코드/리뷰 시 아래를 확인한다. 각 항목은 실제로 반복해서 걸렸던 것들이다.

### 5.1 패키지 · 의존성
- **pnpm만 사용.** `package-lock.json`이 커밋에 섞이면 안 된다(= `npm install` 실수). 발견 시: `package-lock.json` 삭제 → `pnpm install` → `pnpm-lock.yaml`만 커밋.
- 의존성 추가 시 `docs/VERSIONS.md`도 함께 갱신한다. **직접 사용하지 않는 의존성은 추가하지 않는다.**
- `.husky/pre-commit`(Husky + lint-staged)를 삭제하지 않는다. 커밋 훅 보장이 사라진다.

### 5.2 타입 · 네이밍 · 주석
- **`interface`보다 `type`** 을 쓴다(확장이 꼭 필요한 경우 예외). 기존 `card.tsx`/`button.tsx` 등과 일관성.
- 파일명은 **kebab-case** (`empty-states.tsx`, `empty-states.stories.tsx`).
- 주석은 최소화하고 가능하면 한국어. 코드만으로 명확하면 달지 않는다.
- ESLint `noShadowRestrictedNames` 등 위반 금지 — `Error` 같은 전역 예약어를 변수/식별자로 가리지 않는다.

### 5.3 스타일 토큰
- 색상/보더 토큰은 `border-[color:var(--color-gray-300,#CCCCCC)]` 형태로 쓴다. `border-(--color-gray-300,#CCCCCC)` 같은 표기는 기존 패턴과 다르고 적용이 안 될 수 있다.
- fallback 값은 토큰 정의(`src/index.css`)의 실제 값과 맞춘다(예: `--color-primary-700` = `#0056b3`).
- 색상을 하드코딩하지 말고 CSS 변수 + fallback을 쓴다(예: 상태 뱃지, 아바타 status).

### 5.4 배럴(import) · 재사용
- 컴포넌트는 내부 파일 직접 참조 대신 **`index.ts`(public API)로 import** 한다.
- 새 공용 컴포넌트는 `component/index.ts` **그리고** 상위 배럴 `src/shared/ui/index.ts`에 **둘 다** 등록한다(한쪽만 하면 import 경로가 갈린다 — 예: `Loading`/`PageLoading`).
- 이미 있는 공용 컴포넌트(`Button` 등)를 다른 컴포넌트 안에서 다시 만들지 않는다.
- 중복 로직은 한곳으로 모은다(과거 사례: `roleLabels` 3벌, `PortfolioList` vs `profile-posts-grid` 거의 동일, `isRichTextEmpty` 2벌).
- 재사용 컴포넌트의 `<button>`에는 **`type="button"`** 을 명시한다(기본값 submit이라 폼 안에서 의도치 않은 제출 발생).

### 5.5 정적 export(`output: "export"`) 제약 — 자주 깨지는 부분
- 서버 컴포넌트에서 `cache: "no-store"` fetch를 쓰지 않는다(정적 export와 충돌).
- 서버 `searchParams` 기반 페이지네이션 금지. export는 정적 HTML 하나만 만들어 `?page=2`가 서버에 반영되지 않는다. **클라이언트 컴포넌트 + `useSearchParams`(Suspense) 패턴**을 쓴다(포트폴리오 목록 참고).
- 상세 페이지는 **쿼리 파라미터 방식(`/notice/detail?id=`)** 을 쓴다. 동적 `[id]` + 제한적 `generateStaticParams`는 열거 안 된 id에서 404가 난다. 목록·홈 카드의 상세 링크 URL을 서로 통일한다.

### 5.6 백엔드 API 계약 (프론트가 맞춰야 함)
- 정렬 파라미터는 `sortType=LATEST`(POPULAR/VIEWS). `sort`로 보내면 무시된다.
- 목록: `GET /api/posts/{boardType}?page=&size=&sortType=`. `/api/posts/notices`는 **홈 위젯용 최신 4건 전용**이라 목록 페이지에 쓰면 모든 페이지가 같은 4건이 된다.
- 게시글 작성: **인증 필수 + `POST /api/posts/{boardType}` + `multipart/form-data`의 `request` 파트**. JSON POST가 아니다.
- `UserMeResponse`에는 **`userId`가 없다**(내려오는 건 `name`,`postCount`,`likeCount`,`email`,`role`,`department`,`profileBio`). 소유권 판정은 세션 식별자(`useCurrentUserId`)로 하고, `profile.userId` 참조 금지.
- 상세 응답(`PostDetailResponse`)과 목록 DTO는 필드가 다르다(상세엔 `content`/`images`/`files`, 목록엔 없음). 상세 화면은 상세 API를 호출한다.
- env 키는 `NEXT_PUBLIC_BACKEND_API_BASE_URL`. `backendJson`/`backendFetch`를 경유해 base URL·에러 파싱을 함께 처리한다(`NEXT_PUBLIC_API_URL` 같은 별도 키 금지).

### 5.7 에러 처리 · 캐시
- `BackendApiError.message`를 화면에 그대로 렌더하지 않는다(백엔드/프록시 내부 문구 노출). UI엔 고정 문구("잠시 후 다시 시도해주세요.") + 원본은 `console.error`.
- 모든 실패를 `[]`로 삼키지 않는다(장애·env 누락이 "데이터 없음"으로 위장됨). 에러는 전파/타입 구분해 `EmptyState`(error) vs 로딩으로 나눈다.
- 생성/수정/삭제 mutation 성공 후 `clearListCache()` 호출(목록은 `cachedGet` 30초 캐시).

### 5.8 폼 · 상태 · 타이머
- 편집 폼은 id 변경 시 리마운트한다: `<PortfolioForm key={`${boardType}-${postId}`} .../>` (RichEditor content가 생성 시점에만 반영되는 문제도 함께 해결).
- controlled 컴포넌트의 파생값(글자수 카운터 등)은 초기 `value`/`defaultValue`를 반영한다.
- 썸네일 제거는 명시적 상태(`isThumbnailRemoved`)로 폴백을 차단한다.
- `setTimeout` 등은 언마운트/라우트 변경 시 `clearTimeout`으로 정리한다.

### 5.9 자산 · 레이아웃
- `storageAsset("...")`은 Firebase Storage URL 헬퍼다. `public/`에 없는 정적 경로(`/assets/...`)로 바꾸면 배포 후 404. 자산을 실제로 `public/assets/`에 넣거나 헬퍼를 유지한다.
- `/home`은 `AppLayout`이 좌우 패딩을 주지 않는다. 콘텐츠가 자체 래퍼(`mx-auto max-w-360 px-6 md:px-16`)를 가져야 화면 가장자리에 붙지 않는다.
- 로딩 조기 반환도 성공 분기와 같은 래퍼(`flex min-h-screen flex-col` + `Footer`)로 감싸 레이아웃 시프트를 막는다.

### 5.10 하지 말 것
- 실제처럼 보이는 목데이터 화면(하드코딩 대시보드 수치, 목 사용자 관리 등)을 라우트·메뉴 포함해 릴리즈에 넣지 않는다. 실제 `/api/admin/**` 연동과 함께 별도 PR로.
- `next-env.d.ts`의 `.next/dev/types/...` 자동 변경을 커밋하지 않는다(클린 체크아웃/CI에서 깨짐).

---

## 6. 자주 나는 실수 (온보딩 체크)

- `npm install` 실수로 `package-lock.json` 커밋 → pnpm으로 되돌리기(5.1).
- `next-env.d.ts` 자동 변경이 커밋에 섞임 → `git update-index --skip-worktree next-env.d.ts`.
- 정적 export인데 서버 페이지네이션/`no-store` 사용 → 클라 + `useSearchParams`로(5.5).
- 프론트가 백엔드 계약과 어긋남(`sortType`, multipart 작성, `UserMeResponse.userId` 부재 등) → 5.6 확인.
- 리전/도메인 변경 시 컷오버 순서·Cloud Run public invoke 누락 → 2.1.
- 프론트 PR을 `main`으로 올림 → `dev`로 올려야 한다(3.1). 잘못 올렸으면 dev 기준으로 재생성.
