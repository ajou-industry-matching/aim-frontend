# 📚 **AIM AJOU — 반응형 웹앱 SaaS 포트폴리오 관리 시스템**

<div align="center">

![header](https://capsule-render.vercel.app/api?type=soft\&color=0:1E3A8A,50:1E40AF,100:2563EB\&height=190\&section=header\&text=AIM%20AJOU\&fontSize=65\&fontColor=ffffff\&animation=twinkling\&fontAlignY=45)

<br />

[![Website](https://img.shields.io/badge/🚀_Live_Service-portfolio.ajou.sw.kr-1E40AF?style=for-the-badge)](https://portfolio.ajou.sw.kr)
[![Frontend Repo](https://img.shields.io/badge/📦_Frontend_Repository-181717?style=for-the-badge\&logo=github)](https://github.com/ajou-industry-matching/aim-frontend)
[![Backend Repo](https://img.shields.io/badge/🔧_Backend_Repository-181717?style=for-the-badge\&logo=github)](https://github.com/ajou-industry-matching/aim-backend)

<br/>

**AIM AJOU**는 아주대학교 SW 전공 학생들이
프로젝트·활동·역량을 체계적으로 기록하고,
산업 요구 기반으로 포트폴리오를 추천받을 수 있는 **웹 기반 SaaS 플랫폼**입니다.

</div>

---

# **Tech Stack**

<div align="center">

### **Frontend**

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge\&logo=react\&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=fff)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=fff)
![TanStack Router](https://img.shields.io/badge/TanStack_Router-000000?style=for-the-badge)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge\&logo=reactquery\&logoColor=fff)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=fff)

### **Backend**

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge\&logo=springboot\&logoColor=fff)
![MySQL](https://img.shields.io/badge/MySQL-00618A?style=for-the-badge\&logo=mysql\&logoColor=fff)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge\&logo=nginx\&logoColor=fff)

### **Infra**

![Oracle Cloud](https://img.shields.io/badge/Oracle_Cloud-F80000?style=for-the-badge\&logo=oracle\&logoColor=fff)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=000)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge\&logo=githubactions)

</div>

---

# **프로젝트 개요**

AIM AJOU는 다음 기능을 목표로 한다:

* 🔐 **Firebase Auth 기반 사용자 인증**
* 📁 **프로젝트/활동 기록 관리**
* 🧠 **AI 기반 포트폴리오 구성 추천 (향후 기능)**
* 📦 **클라우드 기반 프로젝트 데이터 저장 (Firestore, Storage)**
* 🖥 **반응형 UI를 통한 학생 포트폴리오 웹뷰 제공**
* 🚀 **GitHub Actions + Firebase Hosting 자동 배포 CI/CD**

---

# **폴더 구조**

```
aim-frontend/
 ├─ .storybook/          # Storybook 설정 (main.ts, preview.ts)
 ├─ public/
 ├─ src/
 │   ├─ routes/          # Routing (TanStack Router)
 │   ├─ components/      # 공용 UI
 │   ├─ stores/          # Zustand 상태 관리
 │   ├─ firebase/        # Firebase 초기화
 │   ├─ lib/             # API, QueryClient 등
 │   ├─ hooks/           # Custom hooks
 │   ├─ types/           # 타입 정의
 │   └─ utils/           # 유틸 함수
 ├─ .github/workflows/   # PR Preview & Live Deploy CI/CD
 ├─ .husky/              # pre-commit hooks
 ├─ firebase.json
 ├─ firestore.rules
 ├─ storage.rules
 ├─ eslint.config.js     # ESLint Flat Config
 ├─ prettier.config.cjs
 ├─ tailwind.config.js
 ├─ tsconfig.json
 └─ package.json
```

---

# **개발 환경 세팅**

## 1) Node & Package Manager

* Node: **20.x**
* PNPM 사용

설치:

```sh
brew install pnpm
```

## 2) 의존성 설치

```sh
pnpm install
```

## 3) 로컬 실행

```sh
pnpm dev
```

Local: [http://localhost:5173](http://localhost:5173)
Storybook: http://localhost:6006
---

# **Firebase 설정**

환경변수 파일 `.env` 생성:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_APP_ID=
VITE_API_URL=
```

---

# **API 통신 구조**

Oracle VM → Nginx → Spring Boot → MySQL

Frontend에서 모든 요청은 `src/lib/api.ts`에서 제공하는 Axios instance를 사용함.

* 자동 Authorization 헤더 삽입
* 에러 처리 인터셉터
* Response 타입 안전성 확보

---

# **Routing 구조 (TanStack Router)**

* `/routes/_layout.tsx` : 공통 레이아웃
* `/routes/index.tsx` : 메인 페이지
* `/routes/login.tsx` : 로그인
* `/routes/...` : 기능 단위 추가

ProtectedRoute도 구성 가능.

---

# **상태 관리 (Zustand)**

* authStore → Firebase Auth 상태 관리
* uiStore → 모달/토스트 관리
* appStore → 전역 설정

---

# **서버 상태 관리 (React Query)**

`queryClient`를 이용한 API 캐싱/동기화.

* staleTime
* retry 정책
* suspense 옵션
  등 통합적으로 관리.

---

# **코드 규칙 (ESLint + Prettier)**

### ✔ ESLint (Flat Config)

* React/Hooks 규칙
* TypeScript recommended
* import 정리
* no unused variables

### ✔ Prettier

* 저장 시 자동 포맷팅
* 커밋 전 자동 포맷팅 (Husky)

---

# **Git Hooks (Husky + lint-staged)**

커밋 시 자동:

* eslint --fix
* prettier --write

→ 포맷팅되지 않은 코드는 커밋 불가.

---

# **브랜치 전략 (Git Flow)**

```
main       – 운영/배포 브랜치
dev        – 개발 통합 브랜치
feature/*  – 기능 구현
fix/*      – 버그 수정
chore/*    – 설정/환경 변경
```

---

# **PR 규칙**

* PR은 반드시 `feature/* → dev` 또는 `dev → main`
* 최소 1명 리뷰 승인
* 충돌 해결 필수
* CI 통과 필수
* 머지는 **Squash Merge**

---

# **CI/CD – GitHub Actions + Firebase Hosting**

### PR 생성 →

* 빌드 검사
* ESLint 검사
* Firebase Preview URL 자동 생성

### main에 머지 →

* Firebase Hosting Live 자동 배포

---

# **Firebase 보안 규칙**

### Firestore

* 인증 필요 (read/write 제한)
* 프로젝트/활동 데이터 접근 제어

### Storage

* 이미지/파일 업로드 권한 통제

---

# 문의 / Issue / 협업

* 기능 제안 → Issue
* 코드 리뷰 → PR
* 버그 제보 → Issue
* 문서/설정 변경 → chore 브랜치

---

