// src/api/notice.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//인터페이스 정의
export interface Attachment {
  attachmentId: number;
  attachmentType: "IMAGE" | "FILE";
  originalFilename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  displayOrder: number;
  image: boolean;
}

// 키워드 인터페이스
export interface Keyword {
  keywordId: number;
  keywordName: string;
}

// 공지사항 상세 스펙
export interface Notice {
  postId: number;
  userId: number;
  boardType: "NOTICE" | "PORTFOLIO" | "LAB_INTERN" | "COMPANY_PROJECT" | "CRAWLED_PROJECT";
  title: string;
  content: string;
  description: string;
  videoLink?: string;
  githubLink?: string;
  visibility: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  thumbnailImage: string;
  liked: boolean;
  keywords: Keyword[];
  images: Attachment[];
  files: Attachment[];
}

// 공지사항 목록 조회 함수
export async function getNotices(
  page: number = 1,
  size: number = 10,
): Promise<{ notices: Notice[]; totalPages: number }> {
  try {
    const backendPage = page - 1;

    const response = await fetch(
      `${API_BASE_URL}/api/posts/NOTICE?page=${backendPage}&size=${size}&sort=LATEST`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(`목록 조회 실패: 상태 코드 ${response.status}`);
    }

    const data = await response.json();

    return {
      notices: data.content || data.data || [],
      totalPages: data.totalPages || 1,
    };
  } catch (error) {
    console.error("공지사항 목록을 불러오지 못했습니다:", error);
    return { notices: [], totalPages: 1 };
  }
}

// 게시글 상세 조회 함수
export async function getNoticeById(id: number): Promise<Notice> {
  const response = await fetch(`${API_BASE_URL}/api/posts/NOTICE/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`상세 조회 실패: 상태 코드 ${response.status}`);
  }

  return response.json();
}

// 공지사항 작성 함수
export async function createNotice(noticeData: {
  title: string;
  content: string;
  description: string;
  userId: number;
}) {
  const response = await fetch(`${API_BASE_URL}/api/posts/notices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noticeData),
  });

  if (!response.ok) {
    throw new Error(`공지사항 작성 실패: 상태 코드 ${response.status}`);
  }

  return response.json();
}
