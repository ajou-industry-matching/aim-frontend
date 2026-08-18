// src/app/notice/create/page.tsx
import { NoticeCreateScreen } from "@/screens/notice-create";

export default function NoticeCreateRoute() {
  // 나중에 사용자 권한 검사(관리자인지 확인) 로직이 이곳에 추가될 수 있습니다.
  return <NoticeCreateScreen />;
}
