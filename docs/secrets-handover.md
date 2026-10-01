# 시크릿 인수인계 가이드

프로젝트 인수인계 시 후임자에게 넘겨야 하는 시크릿과 설정값 목록이다.

**이 문서에는 실제 값을 적지 않는다.** GitHub Secrets 는 등록 후 값을 다시 읽을 수 없으므로(API·UI 모두 불가, 소유자도 조회 불가), 값은 아래 "발급·확인 경로"에서 새로 받거나 1Password 등 비밀 관리 도구로 따로 전달한다.

조사 기준일: 2026-10-01

---

## 1. 넘겨야 할 시크릿 (총 10개)

### aim-frontend

| 이름 | 용도 | 사용 지점 | 발급·확인 경로 |
| --- | --- | --- | --- |
| `FIREBASE_SERVICE_ACCOUNT_AJOU_PROJECT_CAFD9` | Firebase Hosting 배포 인증 | `firebase-hosting-merge.yml`, `firebase-hosting-pull-request.yml` | Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성 |
| `BOT_GITHUB_TOKEN` | 데일리 요약 봇이 저장소 활동 조회 | `daily_summary.yml:28` | GitHub > Settings > Developer settings > Personal access tokens. 필요 권한은 대상 저장소 읽기 |
| `SLACK_BOT_TOKEN` | 데일리 요약 슬랙 전송 | `daily_summary.yml:29` | Slack API > 해당 앱 > OAuth & Permissions > Bot User OAuth Token |
| `SLACK_CHANNEL_ID` | 전송 대상 채널 | `daily_summary.yml:30` | Slack 채널 > 세부정보 > 하단 채널 ID |
| `MONITOR_REPOS` | 요약 대상 저장소 목록 | `daily_summary.yml:31` | 시크릿이지만 민감값이 아니다. 저장소 이름 목록이므로 Variables 로 옮겨도 된다 |

### aim-backend

| 이름 | 용도 | 사용 지점 | 발급·확인 경로 |
| --- | --- | --- | --- |
| `DB_URL` | 운영 MySQL 접속 URL | `deploy-cloud-run.yml:27` | Cloud Run `aim-be-prod` 환경변수에서 확인 가능. 형식은 `jdbc:mysql://<host>:3306/<db>?...` |
| `DB_PASSWORD` | 운영 MySQL 비밀번호 | `deploy-cloud-run.yml:29` | Cloud Run `aim-be-prod` 환경변수. 교체 시 MySQL 사용자 비밀번호도 함께 변경 |
| `FIREBASE_CREDENTIALS_JSON` | Firebase Admin SDK(토큰 검증, Storage) | `deploy-cloud-run.yml:33` | Firebase 콘솔 > 서비스 계정 > 새 비공개 키. **base64 인코딩해서 등록**한다 (`FirebaseAdminConfig` 가 디코딩함) |

### aim-crawler

| 이름 | 용도 | 사용 지점 | 발급·확인 경로 |
| --- | --- | --- | --- |
| `DB_PASSWORD` | 크롤러 DB 직접 적재용 | `deploy-cloud-run.yml:96` | 백엔드와 같은 DB. 같은 값 |
| `GCP_SA_KEY` | Cloud Run Job 배포 인증 | `deploy-cloud-run.yml:89` | GCP IAM > 서비스 계정 > 키 추가 |

### 아직 등록되지 않은 것

| 이름 | 비고 |
| --- | --- |
| `CRAWLER_API_KEY` (백엔드) / `CRAWLER_API_TOKEN` (크롤러) | 크롤러 API 적재용 공유 시크릿. 헤더 `X-Crawler-Key` 로 전송한다. 백엔드 구현 전이라 미등록 상태다. aim-backend#51 참고 |

---

## 2. 시크릿이 아닌 설정값

### GitHub Variables (값 조회 가능, 민감하지 않음)

- aim-backend 10개, aim-crawler 19개, aim-frontend 0개
- `gh api repos/ajou-industry-matching/<repo>/actions/variables?per_page=100` 으로 전체 확인

### `.env.production` (aim-frontend, 저장소에 커밋됨)

`NEXT_PUBLIC_` 접두어 7개로만 구성되어 있다. Next.js 가 브라우저 번들에 그대로 포함시키는 값이라 공개가 전제다. Firebase 웹 API 키도 공개 설계이며 실제 보호는 Firebase 보안 규칙(`storage.rules`, Firestore 규칙)이 담당한다. **유출이 아니므로 교체 대상이 아니다.**

### `.env.development.local` (gitignore 대상)

개인 로컬 개발용이다. 후임자가 `.env.example` 을 보고 직접 채우면 된다. 넘길 필요 없다.

---

## 3. 인수인계 절차

1. **후임자를 저장소·GCP·Firebase·Slack 앱에 먼저 초대한다.** 권한이 있어야 본인이 값을 발급할 수 있다.
   - GitHub: 4개 저장소 (`aim-frontend`, `aim-backend`, `aim-crawler`, `aim-design-system`)
   - GCP 프로젝트 `ajou-project-cafd9`
   - Firebase 동일 프로젝트
   - Slack 앱 (데일리 요약 봇)
   - 운영 MySQL 서버
2. **가능한 값은 후임자가 직접 새로 발급하게 한다.** 서비스 계정 키, PAT, Slack 토큰은 모두 재발급이 가능하다. 넘기는 것보다 새로 만드는 쪽이 안전하고, 이전 담당자 이름으로 된 키가 남지 않는다.
3. **재발급이 어려운 값만 1Password 등으로 전달한다.** 현재 기준으로는 `DB_URL`, `DB_PASSWORD` 가 해당한다. 채팅이나 이메일로 보내지 않는다.
4. **인수인계 후 이전 담당자 명의 키를 폐기한다.** 서비스 계정 키 삭제, PAT 폐기, Slack 토큰 재발급.
5. **배포가 실제로 도는지 확인한다.** 값을 교체한 뒤 각 저장소에서 배포 workflow 를 한 번 수동 실행해 성공을 확인한다.

---

## 4. 알려진 정리 과제

- `aim-crawler` workflow 가 `vars.CRAWLER_USER_ID` 를 참조하지만 해당 변수가 등록되어 있지 않다. 빈 값으로 주입되며 `crawler.py` 가 비어 있을 때 시스템 유저를 생성·재사용하도록 되어 있어 현재는 동작한다. 의도된 구성인지 확인이 필요하다.
- `aim-backend` 의 변수 `ARTIFACT_REGISTRY_REPOSITORY`, `CLOUD_RUN_SERVICE`, `GCP_REGION`, `IMAGE_NAME` 이 workflow 에서 사용되지 않는다. workflow 가 같은 값을 파일에 직접 적어 쓰고 있어, 변수를 바꿔도 반영되지 않는다.
- `MONITOR_REPOS` 는 민감값이 아니므로 Variables 로 옮기면 관리가 단순해진다.
