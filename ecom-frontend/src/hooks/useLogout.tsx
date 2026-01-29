// hooks/useLogout.ts
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authStorage } from "../service/authStorage";
import { useLogoutMutation } from "@/react-query/mutations/auth";

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Calls your logout API endpoint
      await logoutMutation.mutateAsync();
      // Clear auth state
      logout();

      // Clear token from authStorage
      authStorage.clearToken();

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API fails, clear local state
      logout();
      authStorage.clearToken();
      navigate("/login");
    }
  };

  return { handleLogout, isLoggingOut: logoutMutation.isPending };
};
