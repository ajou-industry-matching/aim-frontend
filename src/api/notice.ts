// src/api/notice.ts
import { backendJson, backendFetch } from "@/api/client";

// 인터페이스
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

export interface CreateNoticeRequest {
  title: string;
  content: string;
  userId?: number;
  description?: string;
  visibility?: "PUBLIC" | "PRIVATE";
  videoLink?: string | null;
  githubLink?: string | null;
  // 파일/이미지 처리
  images?: number[];
  files?: number[];
}

// 공지사항 목록 조회
export async function getNotices(
  page: number = 1,
  size: number = 10,
): Promise<{ notices: Notice[]; totalPages: number }> {
  const backendPage = page - 1;

  const data = await backendJson<NoticePageResponse>(
    `/api/posts/NOTICE?page=${backendPage}&size=${size}&sortType=LATEST`,
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

// 클라이언트용 상세 조회 함수
export async function getNoticeById(id: number): Promise<Notice | null> {
  const data = await backendJson<Notice>(`/api/posts/NOTICE/${id}`, {
    method: "GET",
    requiresAuth: false,
    cache: "no-store",
  });

  return data;
}

// 공지사항 작성 함수
export async function createNotice(
  noticeData: CreateNoticeRequest,
  files: File[] = [],
): Promise<Notice> {
  const formData = new FormData();

  formData.append("request", new Blob([JSON.stringify(noticeData)], { type: "application/json" }));

  files.forEach((file) => {
    formData.append("files", file);
  });

  // fetch 호출
  const response = await backendFetch("/api/posts/NOTICE", {
    method: "POST",
    body: formData,
    requiresAuth: true,
  });

  if (!response.ok) {
    throw new Error(`공지사항 등록 실패: ${response.status}`);
  }

  return response.json();
}
