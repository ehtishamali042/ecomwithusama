// hooks/useLogout.ts
import { useLogoutMutation } from "@/react-query/mutations/auth";
import { forceLogout } from "@/utils/forceLogout";

export const useLogout = () => {
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Calls your logout API endpoint
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      forceLogout();
    }
  };

  return { handleLogout, isLoggingOut: logoutMutation.isPending };
};
