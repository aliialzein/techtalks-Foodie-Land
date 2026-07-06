// Shared fetch wrapper for the backend API: sends/receives JSON and surfaces
// the backend's `{ error }` message as a thrown Error. One funnel for every
// client module (orders, foods, cart), mirroring the backend's handleError.

export async function apiRequest<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ??
      "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data as T;
}
