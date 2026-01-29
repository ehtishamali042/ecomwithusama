import { useAuthStore } from "@/store/authStore";

export function useUser() {
  const user = useAuthStore((state) => state.user);
  return { user };
}
