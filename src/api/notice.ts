// src/api/notice.ts
import { backendJson } from "@/api/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Attachment {
  attachmentId: number;
  attachmentType: string;
  originalFilename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  displayOrder: number;
  image: boolean;
}

export interface Keyword {
  keywordId: number;
  keywordName: string;
}

export interface Notice {
  postId: number;
  userId: number;
  boardType: string;
  title: string;
  content: string;
  description: string | null;
  videoLink: string | null;
  githubLink: string | null;
  visibility: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  thumbnailImage: string | null;
  liked: boolean;
  keywords: Keyword[];
  images: Attachment[];
  files: Attachment[];
}

interface NoticePageResponse {
  content?: Notice[];
  data?: Notice[];
  totalPages?: number;
}

// 공지사항 목록 조회 (클라이언트/서버 공용)
export async function getNotices(
  page: number = 1,
  size: number = 10,
): Promise<{ notices: Notice[]; totalPages: number }> {
  const backendPage = page - 1;

  const data = await backendJson<NoticePageResponse>(
    `/api/posts/NOTICE?page=${backendPage}&size=${size}&sort=LATEST`,
    {
      method: "GET",
      requiresAuth: false,
      cache: "no-store",
    },
  );

  return {
    notices: data.content || data.data || [],
    totalPages: data.totalPages || 1,
  };
}

// 클라이언트용 단건 상세 조회 함수
export async function getNoticeById(id: number): Promise<Notice | null> {
  const data = await backendJson<Notice>(`/api/posts/NOTICE/${id}`, {
    method: "GET",
    requiresAuth: false,
    cache: "no-store",
  });

  return data;
}

// 공지사항 작성 함수
export async function createNotice(noticeData: Record<string, unknown>) {
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
