// Utility to force logout user (no React hooks)

import { authStorage } from "@/service/authStorage";
import { useAuthStore } from "@/store/authStore";
import { QueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { NOTIFICATION_MESSAGES } from "@/constants/notificationMessages";

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_INTERVAL = 300;

function doForceLogout() {
  const token = authStorage.getToken();
  const { user, logout } = useAuthStore.getState();
  // Only force logout if user is still considered logged in
  if (!token && !user) return;
  // Show notification
  notificationService.showInfo(NOTIFICATION_MESSAGES.AUTH.FORCE_LOGOUT);
  // Clear token
  authStorage.clearToken();
  // Clear Zustand auth store
  logout();
  // Clear all react-query cache
  const queryClient = new QueryClient();
  queryClient.clear();
  // No manual redirect; router will handle navigation to /login
}

export function forceLogout() {
  if (debounceTimeout) return;
  debounceTimeout = setTimeout(() => {
    doForceLogout();
    debounceTimeout = null;
  }, DEBOUNCE_INTERVAL);
}
