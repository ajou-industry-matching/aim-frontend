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
  adminRole: "NONE" | "ADMIN" | "SUPER_ADMIN" | null;
  name: string | null;
  department: string | null;
};

type BackendLoginErrorOptions = {
  status?: number;
  payload?: unknown;
};

export class BackendLoginError extends Error {
  status?: number;
  payload?: unknown;

  constructor(message: string, options: BackendLoginErrorOptions = {}) {
    super(message);
    this.name = "BackendLoginError";
    this.status = options.status;
    this.payload = options.payload;
  }
}

const getBackendApiBaseUrl = (): string => {
  const backendApiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "";

  return backendApiBaseUrl.replace(/\/$/, "");
};

const parseErrorPayload = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => undefined);
  }

  return response.text().catch(() => undefined);
};

const getErrorMessage = (payload: unknown, status: number): string => {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  return `Backend login failed. (${status})`;
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
    const errorPayload = await parseErrorPayload(response);

    throw new BackendLoginError(getErrorMessage(errorPayload, response.status), {
      status: response.status,
      payload: errorPayload,
    });
  }

  return response.json() as Promise<BackendUser>;
};
