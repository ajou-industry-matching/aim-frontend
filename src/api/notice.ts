// src/api/notice.ts

// .env.local 파일에 설정해둔 백엔드 기본 주소를 가져옵니다.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Keyword {
  keywordId: number;
  keywordName: string;
}

export interface Notice {
  postId: number;
  userId: number;
  boardType: string;
  title: string;
  description: string;
  visibility: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  thumbnailImage: string;
  liked: boolean;
  keywords: Keyword[];
}

export async function getNotices(): Promise<Notice[]> {
  try {
    // 환경변수 기본 주소와 API 엔드포인트를 조합하여 GET 요청을 보냅니다.
    const response = await fetch(`${API_BASE_URL}/api/posts/notices`, {
      cache: "no-store", // SSG 환경에서도 이 요청은 항상 최신 데이터를 가져오도록 강제합니다.
    });

    if (!response.ok) {
      throw new Error(`API 통신 오류: 상태 코드 ${response.status}`);
    }

    const data = await response.json();

    // 💡 참고: 백엔드(Spring)에서 페이지네이션 객체(Page<T>)를 반환하는 경우,
    // 실제 배열 데이터는 data.content 또는 data.data 안에 들어있을 확률이 높습니다.
    // 만약 화면에 데이터가 뜨지 않는다면 Swagger 응답 예시를 확인하시고 아래 리턴 부분을 맞춰주세요.
    return data.content || data.data || data;
  } catch (error) {
    console.error("공지사항 목록을 불러오지 못했습니다:", error);
    return []; // 에러가 발생해도 빈 배열을 반환하여 화면 전체가 하얗게 터지는 것을 방지합니다.
  }
}

export async function createNotice(noticeData: {
  title: string;
  description: string;
  userId: number;
}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_BASE_URL}/api/posts/notices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 만약 백엔드에서 로그인이 필요하다면 아래와 같이 토큰을 담아주어야 합니다.
      // "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(noticeData),
  });

  if (!response.ok) {
    throw new Error(`공지사항 작성에 실패했습니다: 상태 코드 ${response.status}`);
  }

  // 성공적으로 작성되었을 때 백엔드가 주는 응답 데이터를 반환합니다.
  return response.json();
}
