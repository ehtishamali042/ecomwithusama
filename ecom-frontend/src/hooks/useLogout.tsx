// hooks/useLogout.ts
import { useLogoutMutation } from "@/react-query/mutations/auth";

import { useAppStore } from "@/store/appStore";
import { forceLogout } from "@/utils/forceLogout";

export const useLogout = () => {
  const logoutMutation = useLogoutMutation();
  const { setInitPhase } = useAppStore();

  const handleLogout = async () => {
    try {
      // Calls your logout API endpoint
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      forceLogout();
      setInitPhase("public"); // Set to public phase to start auth flow on logout
    }
  };

  return { handleLogout, isLoggingOut: logoutMutation.isPending };
};
