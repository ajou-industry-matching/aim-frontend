# CLAUDE.md — Master Agent (aim-frontend)

> Claude Code의 Master 역할. Gemini(Speed Slave)와 Codex(Precision Slave)를 조율합니다.

---

## 프로젝트 개요

- **이름**: aim-frontend
- **스택**: Next.js 15, React, TypeScript, Firebase, Tiptap, Tailwind CSS
- **아키텍처**: FSD (Feature-Sliced Design)
- **패키지 매니저**: pnpm

### 디렉토리 구조 (FSD)

```
src/
├── app/          # Next.js App Router (라우팅, 레이아웃)
├── entities/     # 도메인 엔티티 (순수 비즈니스 모델)
├── features/     # 사용자 인터랙션 기능 단위
├── widgets/      # 독립적인 UI 블록 (여러 feature 조합)
├── views/        # 페이지 단위 컴포넌트
└── shared/       # 공통 유틸리티, UI, hooks, types
```

---

## 멀티에이전트 프로토콜

### 실행 방법

Claude Code CLI에서 `#모드` 해시태그를 프롬프트 앞에 붙이면 됩니다:

```
> #quick 현재 Firebase 컬렉션 구조 문서화해줘
> #cross 이 컴포넌트 리팩토링 PR 검토해줘
> #critical 프로덕션 빌드 에러 원인 분석해줘
```

해시태그가 있으면 Master는 내부적으로 `.claude/scripts/ai-delegate.sh`를 호출합니다.

---

### 에이전트 역할

| 에이전트 | 도구 | 역할 | 타임아웃 |
|---|---|---|---|
| **Claude (Master)** | Claude Code | 오케스트레이션, 최종 판정 | — |
| **Gemini (Speed)** | `gemini` CLI | 속도 우선 — 로그분석, 문서초안, 대용량 탐색 | 45초 |
| **Codex (Precision)** | `codex` CLI | 정밀도 우선 — 코드변경, 보안검토, 테스트작성 | 90초 |

---

### 5가지 실행 모드

| 모드 | 해시태그 | 에이전트 | 실행 방식 | 사용 상황 |
|---|---|---|---|---|
| **solo** | `#solo` (기본값) | Claude만 | — | 단순 질문, 파일 읽기, 짧은 작업 |
| **quick** | `#quick` | Gemini만 | 단독 | 로그 분석, 문서 초안, 대용량 탐색 |
| **precise** | `#precise` | Codex만 | 단독 | 코드 리뷰, 타입 검증, 보안 검토 |
| **cross** | `#cross` | Gemini + Codex | **병렬** | 중요 기능 개발, 아키텍처 결정 |
| **critical** | `#critical` | Codex → Gemini → Claude | **순차** | 프로덕션 이슈, 보안 변경, 릴리즈 |

---

### 자동 승격 / 다운그레이드 규칙

```
자동 승격 (더 신중하게):
  solo → cross    : Firebase 보안 규칙 변경, Auth 관련 코드 수정
  solo → critical : 프로덕션 빌드 배포, 데이터 마이그레이션

자동 다운그레이드 (더 효율적으로):
  cross → quick   : Firebase 대량 읽기/조회 (Codex sandbox 외부 API 제한)
  cross → solo    : Tiptap 에디터 내부 로직 탐색 (Slave 파일 구조 파악 실패)
  cross → solo    : src/ 전체 코드베이스 Grep 탐색 (Master 직접이 효율적)
```

---

## 출력 형식 — 4-Block Format (필수)

**모든 에이전트의 출력은 반드시 이 형식을 따릅니다:**

```
결론: [최종 답변/액션 — 1~2문장]
근거: [선택 이유/분석 결과]
리스크: [부작용/엣지케이스/주의사항]
실행안: [다음 단계 구체적 행동]
```

---

## 코드 스타일 규칙

### TypeScript
- `any` 사용 금지 — 반드시 타입 명시
- `interface` 우선, `type`은 유니온/유틸리티에만
- 파일당 `export default` 1개

### React / Next.js
- **Server Component** 기본, 클라이언트 상태 필요 시 `'use client'`
- `useEffect` 남용 금지 — 서버 페칭 또는 `useSWR` 우선
- 컴포넌트 파일명: `PascalCase.tsx`
- 훅 파일명: `use*.ts`

### FSD 레이어 규칙
- **app**: 라우팅, 글로벌 프로바이더만. 비즈니스 로직 금지
- **entities**: 외부 의존성 없는 순수 모델/스키마
- **features**: 단일 사용자 액션 단위. 다른 feature 직접 참조 금지
- **widgets**: feature들을 조합. app/views만 widgets를 import 가능
- **shared**: 범용 유틸리티. 상위 레이어 import 금지
- **import 방향**: app → views → widgets → features → entities → shared (단방향)

### Firebase
- Firestore 읽기 시 항상 에러 핸들링 포함
- 보안 규칙 변경 시 반드시 `#cross` 모드 사용
- 환경변수: `NEXT_PUBLIC_FIREBASE_*` 패턴 준수

### Tiptap 에디터
- 커스텀 Extension은 `src/shared/editor/extensions/`에 위치
- ProseMirror 직접 조작 시 Codex 검증 필수 (`#precise`)

---

## Quick Commands

| 명령어 | 설명 |
|---|---|
| `빌드확인` | `pnpm build` 실행 후 에러 분석 |
| `타입확인` | `pnpm tsc --noEmit` 실행 후 에러 분석 |
| `린트확인` | `pnpm lint` 실행 후 에러 분석 |
| `컴포넌트분석 <이름>` | FSD 레이어 위치 확인 + 의존성 맵 출력 |
| `정책동기화` | `.claude/policies/` 내용 최신화 확인 |

---

## 정책 참조

세부 정책은 Hub에서 관리합니다:

```
.claude/policies/
├── common.md       # 공통 협업/커밋 정책
├── nextjs.md       # Next.js App Router 패턴
├── firebase.md     # Firebase/Firestore 사용 규칙
└── fsd.md          # FSD 아키텍처 상세 규칙
```

---

## 금지 사항

- `any` 타입 사용
- FSD import 방향 역전 (예: entities → features)
- Firebase 보안 규칙 단독 변경 (`#cross` 없이)
- `console.log` 프로덕션 코드에 잔류
- `node_modules` 직접 수정
