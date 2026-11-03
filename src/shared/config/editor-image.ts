// 에디터 본문 이미지 허용 조건. 파일 선택 창(accept)과 업로드 검사가 같은 값을 쓴다.
// SVG는 Storage 링크를 직접 열면 스크립트가 실행될 수 있어 받지 않는다.
export const EDITOR_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

// 백엔드 첨부파일 한도(max-file-size: 20MB)와 맞춘다.
export const EDITOR_IMAGE_MAX_BYTES = 20 * 1024 * 1024;

/**
 * 사용자에게 그대로 보여줘도 되는 업로드 실패. 에디터는 이 에러의 문구만 노출하고,
 * 그 밖의 에러(Firebase 원문 등)는 공통 안내 문구로 바꿔 보여준다.
 * api(던짐)와 ui(표시)가 함께 쓰므로 두 계층 아래인 shared/config에 둔다.
 */
export class ImageUploadUserError extends Error {}
