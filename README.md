# 📚 **AIM AJOU — 반응형 웹앱 SaaS 포트폴리오 관리 시스템**

<div align="center">

![header](https://capsule-render.vercel.app/api?type=soft&color=0:1E3A8A,50:1E40AF,100:2563EB&height=190&section=header&text=AIM%20AJOU&fontSize=65&fontColor=ffffff&animation=twinkling&fontAlignY=45)

<br />

[![Website](https://img.shields.io/badge/🚀_Live_Service-portfolio.ajou.sw.kr-1E40AF?style=for-the-badge)](https://portfolio.ajou.sw.kr)
[![Frontend Repo](https://img.shields.io/badge/📦_Frontend_Repository-181717?style=for-the-badge&logo=github)](https://github.com/ajou-industry-matching/aim-frontend)
[![Backend Repo](https://img.shields.io/badge/🔧_Backend_Repository-181717?style=for-the-badge&logo=github)](https://github.com/ajou-industry-matching/aim-backend)

<br/>

**AIM AJOU**는 아주대학교 SW 전공 학생들이
프로젝트·활동·역량을 체계적으로 기록하고,
산업 요구 기반으로 포트폴리오를 추천받을 수 있는 **웹 기반 SaaS 플랫폼**입니다.

</div>

---

## Tech Stack

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=fff)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=fff)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=fff)

### Backend

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=fff)
![MySQL](https://img.shields.io/badge/MySQL-00618A?style=for-the-badge&logo=mysql&logoColor=fff)

### Infra

![Oracle Cloud](https://img.shields.io/badge/Oracle_Cloud-F80000?style=for-the-badge&logo=oracle&logoColor=fff)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=000)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions)

</div>

---

## 빠른 시작

```bash
pnpm install
pnpm dev        # Next.js 개발 서버
pnpm storybook  # Storybook (포트 6006)
pnpm build      # 정적 산출물(out) 생성
pnpm preview    # 정적 산출물 로컬 미리보기
pnpm lint       # 린트 검사
```

> 환경 변수(.env) 설정이 필요합니다. 팀 노션을 참고하세요.

---

## 현재 구조 메모

- 앱 실행 기준은 `Next.js App Router`입니다.
- `src/app`가 라우팅 엔트리이며, 공개 SEO 페이지는 `SSG 중심`, 인증 기반 내부 페이지는 `CSR 중심`으로 분리하는 방향으로 전환을 진행 중입니다.
- Vite 직접 의존성과 레거시 앱 엔트리(`src/main.tsx`, `index.html`, `vite.config.ts`)는 제거했습니다.
- Storybook은 `@storybook/nextjs` 기준으로 전환했습니다.
- Firebase Hosting은 Next 정적 산출물(`out/`)을 직접 배포하는 구조로 정리했습니다.
- 구조 설계 문서는 [docs/seo-nextjs-migration-plan.md](./docs/seo-nextjs-migration-plan.md)에서 관리합니다.

---

## 개발 가이드

프로젝트 구조, 컨벤션, 워크플로우는 **[docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)** 를 참고하세요.
