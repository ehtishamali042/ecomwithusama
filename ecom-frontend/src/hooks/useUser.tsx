import { useAuthStore } from "@/store/authStore";

export function useUser() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  return { user, updateUser };
}
