"use client";

import { auth } from "@/shared/config/firebase";

export type BackendFetchOptions = RequestInit & {
  requiresAuth?: boolean;
};

export type BackendJsonOptions<RequestBody = unknown> = Omit<BackendFetchOptions, "body"> & {
  body?: BodyInit | null;
  json?: RequestBody;
};

type BackendApiErrorOptions = {
  status?: number;
  payload?: unknown;
  response?: Response;
};

export class BackendApiError extends Error {
  status?: number;
  payload?: unknown;
  response?: Response;

  constructor(message: string, options: BackendApiErrorOptions = {}) {
    super(message);
    this.name = "BackendApiError";
    this.status = options.status;
    this.payload = options.payload;
    this.response = options.response;
  }
}

const getBackendApiBaseUrl = (): string => {
  const backendApiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "";

  return backendApiBaseUrl.replace(/\/$/, "");
};

const createBackendApiUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getBackendApiBaseUrl()}${normalizedPath}`;
};

const isFormDataBody = (body: BodyInit | null | undefined): body is FormData =>
  typeof FormData !== "undefined" && body instanceof FormData;

const parseResponsePayload = async (response: Response): Promise<unknown> => {
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

  return `Backend API request failed. (${status})`;
};

const throwBackendApiError = async (response: Response): Promise<never> => {
  const payload = await parseResponsePayload(response);

  throw new BackendApiError(getErrorMessage(payload, response.status), {
    status: response.status,
    payload,
    response,
  });
};

const appendAuthHeader = async (headers: Headers): Promise<void> => {
  if (headers.has("Authorization")) {
    return;
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new BackendApiError("로그인이 필요한 요청입니다.", { status: 401 });
  }

  const idToken = await currentUser.getIdToken();
  headers.set("Authorization", `Bearer ${idToken}`);
};

export const backendFetch = async (
  path: string,
  { requiresAuth = true, headers: headersInit, ...init }: BackendFetchOptions = {},
): Promise<Response> => {
  const headers = new Headers(headersInit);

  if (requiresAuth) {
    await appendAuthHeader(headers);
  }

  const response = await fetch(createBackendApiUrl(path), {
    ...init,
    headers,
  });

  if (!response.ok) {
    await throwBackendApiError(response);
  }

  return response;
};

export const backendJson = async <ResponseBody, RequestBody = unknown>(
  path: string,
  { json, body, headers: headersInit, method, ...init }: BackendJsonOptions<RequestBody> = {},
): Promise<ResponseBody> => {
  if (json !== undefined && body !== undefined) {
    throw new BackendApiError("body와 json은 동시에 사용할 수 없습니다.");
  }

  const requestBody = json === undefined ? body : JSON.stringify(json);
  const headers = new Headers(headersInit);

  if (json !== undefined && !headers.has("Content-Type") && !isFormDataBody(requestBody)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await backendFetch(path, {
    ...init,
    method: method ?? (json === undefined ? undefined : "POST"),
    headers,
    body: requestBody,
  });

  if (response.status === 204) {
    return undefined as ResponseBody;
  }

  const responseText = await response.text();

  if (!responseText) {
    return undefined as ResponseBody;
  }

  return JSON.parse(responseText) as ResponseBody;
};
