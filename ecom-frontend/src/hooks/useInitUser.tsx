import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { hasValidToken } from "@/utils/tokenUtils";

export function useInitUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const fetchAndSetUser = useCallback(async () => {
    if (!hasValidToken()) {
      // Don't fetch user if no valid token
      return;
    }
    const data = await queryClient.fetchQuery({
      queryKey: ["me"],
      queryFn: getMe,
    });
    setUser(data);
  }, [queryClient, setUser]);

  return { initUser: fetchAndSetUser };
}
