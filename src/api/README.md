# API client

백엔드 API 호출은 `backendFetch` 또는 `backendJson`을 사용합니다.

```ts
import { backendJson } from "@/api/client";

type Portfolio = {
  id: number;
  title: string;
};

const portfolios = await backendJson<Portfolio[]>("/api/portfolios");
```

기본값은 인증이 필요한 요청입니다. Firebase 로그인 사용자가 있으면
`auth.currentUser.getIdToken()`으로 Firebase ID Token을 가져와
`Authorization: Bearer {token}` 헤더를 자동으로 추가합니다.

공개 API처럼 인증이 필요 없는 요청은 `requiresAuth: false`를 사용합니다.

```ts
const notices = await backendJson<Notice[]>("/api/notices", {
  requiresAuth: false,
});
```

JSON 요청은 `json` 옵션을 사용합니다.

```ts
await backendJson<UserProfile, UpdateUserProfileRequest>("/api/users/me", {
  method: "PATCH",
  json: {
    name: "권세빈",
    department: "소프트웨어및컴퓨터공학전공",
  },
});
```

파일 업로드처럼 `FormData`를 보내는 경우에는 `body`를 사용합니다. 이때
`Content-Type`은 브라우저가 boundary를 포함해 설정해야 하므로 직접 지정하지 않습니다.

```ts
const formData = new FormData();
formData.append("file", file);

await backendJson<UploadResponse>("/api/files", {
  method: "POST",
  body: formData,
});
```
