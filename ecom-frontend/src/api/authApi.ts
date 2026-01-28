import fetcher from "./fetcher";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  // Add other fields as needed
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}

export const login = (data: LoginData): Promise<AuthResponse> =>
  fetcher.post("/auth/login", data);
export const register = (data: RegisterData): Promise<RegisterResponse> =>
  fetcher.post("/auth/register", data);
export const refreshToken = (data: RefreshTokenData): Promise<AuthResponse> =>
  fetcher.post("/auth/refresh", data);
export const logout = (): Promise<void> => fetcher.post("/auth/logout");
export const getMe = (): Promise<{ user: { id: string; email: string } }> =>
  fetcher.get("/auth/me");
