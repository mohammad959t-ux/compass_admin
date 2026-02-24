export type ApiError = {
  message: string;
  status: number;
  details?: unknown;
};

async function parseJsonSafely(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createApiClient({
  baseUrl,
  credentials
}: {
  baseUrl: string;
  credentials?: RequestCredentials;
}) {
  const request = async <T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {})
      }
    });

    const data = await parseJsonSafely(response);

    if (!response.ok) {
      const error: ApiError = {
        message:
          (data && (data as { message?: string }).message) ||
          response.statusText ||
          "Request failed",
        status: response.status,
        details: data
      };
      throw error;
    }

    return data as T;
  };

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined
      }),
    put: <T>(path: string, body?: unknown) =>
      request<T>(path, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined
      }),
    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, {
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined
      }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" })
  };
}
