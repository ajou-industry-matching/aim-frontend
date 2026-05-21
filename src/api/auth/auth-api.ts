export type AuthRole = "STUDENT" | "PROFESSOR" | "COMPANY";

export type BackendLoginRequest = {
  role: AuthRole;
  name: string;
  department: string;
};

export type BackendUser = {
  userId: number;
  role: AuthRole;
  status: "ACTIVE" | "BLOCKED" | "SUSPENDED" | "PENDING";
  adminRole: "NONE" | "ADMIN" | "SUPER_ADMIN";
  name: string;
  department: string;
};

export class BackendLoginError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "BackendLoginError";
    this.status = status;
  }
}

const getBackendApiBaseUrl = (): string => {
  const backendApiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "";

  return backendApiBaseUrl.replace(/\/$/, "");
};

export const loginWithBackend = async (
  idToken: string,
  payload: BackendLoginRequest,
): Promise<BackendUser> => {
  let response: Response;

  try {
    response = await fetch(`${getBackendApiBaseUrl()}/api/auth/login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    throw new BackendLoginError("Backend login network failed.");
  }

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new BackendLoginError(
      message || `Backend login failed. (${response.status})`,
      response.status,
    );
  }

  return response.json() as Promise<BackendUser>;
};
