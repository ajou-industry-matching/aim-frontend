import { BackendLoginError, GoogleProfileRoleError } from "@/api/auth";

export const getAuthErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String(error.code);

    switch (code) {
      case "auth/invalid-email":
        return "이메일 형식이 올바르지 않습니다.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "이메일 또는 비밀번호를 확인해주세요.";
      case "auth/popup-closed-by-user":
        return "로그인 창이 닫혔습니다.";
      case "auth/network-request-failed":
        return "네트워크 연결을 확인해주세요.";
      default:
        break;
    }
  }

  if (error instanceof BackendLoginError) {
    if (!error.status) {
      return "백엔드 서버에 연결할 수 없습니다. 서버 실행 상태와 CORS 설정을 확인해주세요.";
    }

    if (error.status === 401 || error.status === 403) {
      return "백엔드에서 로그인 권한을 확인하지 못했습니다.";
    }

    return `백엔드 로그인 처리 중 문제가 발생했습니다. (${error.status})`;
  }

  if (error instanceof GoogleProfileRoleError) {
    return "Google 계정의 구성원 구분을 확인할 수 없습니다. 관리자에게 문의해주세요.";
  }

  if (error instanceof TypeError) {
    return "네트워크 요청 중 문제가 발생했습니다.";
  }

  return "로그인 중 문제가 발생했습니다.";
};
