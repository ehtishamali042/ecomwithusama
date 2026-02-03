// Utility to force logout user (no React hooks)
import { authStorage } from "@/service/authStorage";
import { useAuthStore } from "@/store/authStore";
import { QueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { NOTIFICATION_MESSAGES } from "@/constants/notificationMessages";

export function forceLogout() {
  // Show notification
  notificationService.showInfo(NOTIFICATION_MESSAGES.AUTH.FORCE_LOGOUT);
  // Clear token
  authStorage.clearToken();
  // Clear Zustand auth store
  const { logout } = useAuthStore.getState();
  logout();
  // Clear all react-query cache
  const queryClient = new QueryClient();
  queryClient.clear();
  // No manual redirect; router will handle navigation to /login
}
