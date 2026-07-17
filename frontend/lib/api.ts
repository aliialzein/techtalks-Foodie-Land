import { getToken } from "./auth";

export async function apiRequest<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const token = getToken();

  const headers = new Headers(init?.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.message ??
      data?.error ??
      "Something went wrong. Please try again."
    );
  }

  return data as T;
}