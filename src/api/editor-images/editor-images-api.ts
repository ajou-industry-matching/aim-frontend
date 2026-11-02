import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "@/shared/config/firebase";

// storage.rules의 `{prefix}/{uid}/{fileName}` 규칙과 같은 경로 체계를 쓴다.
export type EditorImagePathPrefix = "posts" | "notices";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
// 백엔드 첨부파일 한도(max-file-size: 20MB)와 맞춘다. storage.rules에도 같은 값이 있다.
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export class EditorImageUploadError extends Error {}

// 경로에 쓸 수 없는 문자를 걷어낸다. 한글 등은 밑줄로 바뀌지만 앞의 timestamp로 구분된다.
const toSafeFileName = (name: string): string => name.replace(/[^\w.-]/g, "_");

/**
 * 에디터 본문 이미지를 Firebase Storage에 올리고 다운로드 URL을 돌려준다.
 * 본문에 base64를 그대로 넣으면 Post.content(TEXT, 64KB) 한도를 넘기므로 URL만 남긴다.
 */
export const uploadEditorImage = async (
  file: File,
  prefix: EditorImagePathPrefix,
): Promise<string> => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new EditorImageUploadError("PNG, JPG, GIF, WEBP, SVG 이미지만 넣을 수 있어요.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new EditorImageUploadError("이미지는 20MB 이하만 넣을 수 있어요.");
  }

  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new EditorImageUploadError("로그인 후 이미지를 넣을 수 있어요.");
  }

  const imageRef = ref(storage, `${prefix}/${uid}/${Date.now()}-${toSafeFileName(file.name)}`);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
};

/**
 * 내가 올린 에디터 이미지(`{prefix}/{내 uid}/...`)만 지운다.
 * 외부 URL이나 다른 사람이 올린 이미지는 건드리지 않는다. 실패해도 저장 흐름을 막지 않도록 false만 돌려준다.
 */
export const deleteEditorImage = async (
  url: string,
  prefix: EditorImagePathPrefix,
): Promise<boolean> => {
  const uid = auth.currentUser?.uid;
  if (!uid) return false;

  let imageRef;
  try {
    // 우리 버킷의 다운로드 URL이 아니면 ref 생성 단계에서 예외가 난다.
    imageRef = ref(storage, url);
  } catch {
    return false;
  }
  if (!imageRef.fullPath.startsWith(`${prefix}/${uid}/`)) return false;

  try {
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error("Failed to delete editor image", error);
    return false;
  }
};
