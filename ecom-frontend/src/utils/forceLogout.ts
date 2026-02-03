// Utility to force logout user (no React hooks)
import { authStorage } from "@/service/authStorage";
import { useAuthStore } from "@/store/authStore";
import { QueryClient } from "@tanstack/react-query";

export function forceLogout() {
  // Clear token
  authStorage.clearToken();
  // Clear Zustand auth store
  const { logout } = useAuthStore.getState();
  logout();
  // Clear all react-query cache
  const queryClient = new QueryClient();
  queryClient.clear();
  // Redirect to login
  window.location.href = "/login";
}
