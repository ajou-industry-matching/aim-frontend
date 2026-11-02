import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "@/shared/config/firebase";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
// 백엔드 첨부파일 한도(max-file-size: 20MB)와 맞춘다. storage.rules에는 크기 제한이 없다.
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export class EditorImageUploadError extends Error {}

// 경로에 쓸 수 없는 문자를 걷어낸다. 한글 등은 밑줄로 바뀌지만 앞의 timestamp로 구분된다.
const toSafeFileName = (name: string): string => name.replace(/[^\w.-]/g, "_");

/**
 * 에디터 본문 이미지를 Firebase Storage에 올리고 다운로드 URL을 돌려준다.
 * 본문에 base64를 그대로 넣으면 Post.content(TEXT, 64KB) 한도를 넘기므로 URL만 남긴다.
 */
export const uploadEditorImage = async (file: File): Promise<string> => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new EditorImageUploadError("PNG, JPG, GIF, WEBP, SVG 이미지만 넣을 수 있어요.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new EditorImageUploadError("이미지는 20MB 이하만 넣을 수 있어요.");
  }

  // storage.rules가 로그인 사용자만 업로드를 허용한다.
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new EditorImageUploadError("로그인 후 이미지를 넣을 수 있어요.");
  }

  const imageRef = ref(storage, `posts/${uid}/${Date.now()}-${toSafeFileName(file.name)}`);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
};
