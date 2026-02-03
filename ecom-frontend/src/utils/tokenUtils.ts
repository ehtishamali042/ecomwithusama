// Utility to check if a valid auth token exists
import { authStorage } from "@/service/authStorage";

export function hasValidToken(): boolean {
  const token = authStorage.getToken?.();
  // Add more validation if your token has a format (e.g., JWT)
  return typeof token === "string" && token.length > 0;
}
