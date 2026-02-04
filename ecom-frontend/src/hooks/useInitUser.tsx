import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { hasValidToken } from "@/utils/tokenUtils";
import { useAppStore } from "@/store/appStore";

export function useInitUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  const { setInitPhase } = useAppStore();

  const fetchAndSetUser = useCallback(async () => {
    setInitPhase("authCheck");
    if (!hasValidToken()) {
      setInitPhase("public");
      return;
    }
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: getMe,
      });
      setUser(data);
      setInitPhase("ready");
    } catch (err) {
      setInitPhase("error", "Failed to load user profile. Please try again.");
    }
  }, [queryClient, setUser, setInitPhase]);

  return { initUser: fetchAndSetUser };
}

// useAppInitPhase moved to hooks/useAppInitPhase.tsx
