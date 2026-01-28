const API_BASE_URL = "http://localhost:3000/api"; // Adjust to your NestJS backend URL

class Fetcher {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers
        ? Object.fromEntries(
            Object.entries(options.headers).map(([k, v]) => [k, String(v)]),
          )
        : {}),
    };
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }
    const config: RequestInit = {
      headers,
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

const fetcher = new Fetcher(API_BASE_URL);
// On module load, set accessToken from localStorage if present
const token =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
if (token) {
  fetcher.setAccessToken(token);
}

export default fetcher;
