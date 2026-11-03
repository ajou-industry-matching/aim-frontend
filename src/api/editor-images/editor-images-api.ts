import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  EDITOR_IMAGE_MAX_BYTES,
  EDITOR_IMAGE_TYPES,
  ImageUploadUserError,
} from "@/shared/config/editor-image";
import { auth, storage } from "@/shared/config/firebase";

export type EditorImagePathPrefix = "posts" | "notices";

// 경로에 쓸 수 없는 문자를 걷어낸다. 한글 등은 밑줄로 바뀌지만 앞의 timestamp로 구분된다.
const toSafeFileName = (name: string): string => name.replace(/[^\w.-]/g, "_");

const toStorageRef = (url: string) => {
  try {
    const imageRef = ref(storage, url);
    // 다른 버킷의 URL은 우리 이미지가 아니다.
    return imageRef.bucket === storage.app.options.storageBucket ? imageRef : null;
  } catch {
    // Storage 다운로드 URL 형식이 아니면 ref 생성 단계에서 예외가 난다.
    return null;
  }
};

/**
 * 에디터 본문 이미지를 `{prefix}/{uid}/...`에 올리고 다운로드 URL을 돌려준다.
 * 본문에 base64를 그대로 넣으면 Post.content(TEXT, 64KB) 한도를 넘기므로 URL만 남긴다.
 * 타입·크기 검사는 여기서만 한다. Storage 규칙으로 강제하는 작업은 #227.
 */
export const uploadEditorImage = async (
  file: File,
  prefix: EditorImagePathPrefix,
): Promise<string> => {
  if (!EDITOR_IMAGE_TYPES.includes(file.type)) {
    throw new ImageUploadUserError("PNG, JPG, GIF, WEBP 이미지만 넣을 수 있어요.");
  }
  if (file.size > EDITOR_IMAGE_MAX_BYTES) {
    throw new ImageUploadUserError("이미지는 20MB 이하만 넣을 수 있어요.");
  }

  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new ImageUploadUserError("로그인 후 이미지를 넣을 수 있어요.");
  }

  const imageRef = ref(storage, `${prefix}/${uid}/${Date.now()}-${toSafeFileName(file.name)}`);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
};

/** 우리 버킷의 `{prefix}/` 아래 에디터 이미지 URL인지. 붙여넣기 제한에 쓴다. */
export const isEditorImageUrl = (url: string, prefix: EditorImagePathPrefix): boolean =>
  toStorageRef(url)?.fullPath.startsWith(`${prefix}/`) ?? false;

/**
 * 내가 올린 에디터 이미지(`{prefix}/{내 uid}/...`)만 지운다.
 * 외부 URL이나 다른 사람이 올린 이미지는 건드리지 않는다. 실패해도 저장 흐름을 막지 않도록 false만 돌려준다.
 */
export const deleteEditorImage = async (
  url: string,
  prefix: EditorImagePathPrefix,
): Promise<boolean> => {
  const uid = auth.currentUser?.uid;
  const imageRef = toStorageRef(url);
  if (!uid || !imageRef || !imageRef.fullPath.startsWith(`${prefix}/${uid}/`)) return false;

  try {
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error("Failed to delete editor image", error);
    return false;
  }
};
