import { getAuthToken } from "@/store/auth";

export const applyAuthToRequest = (init: RequestInit = {}): RequestInit => {
  const headers = new Headers(init.headers ?? {});
  const token = getAuthToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  return {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  };
};

export const fetchWithAuth = (input: RequestInfo | URL, init?: RequestInit) => {
  return fetch(input, applyAuthToRequest(init));
};
