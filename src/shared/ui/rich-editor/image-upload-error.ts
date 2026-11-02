/**
 * 사용자에게 그대로 보여줘도 되는 업로드 실패. 에디터는 이 에러의 문구만 노출하고,
 * 그 밖의 에러(Firebase 원문 등)는 공통 안내 문구로 바꿔 보여준다.
 */
export class ImageUploadUserError extends Error {}
