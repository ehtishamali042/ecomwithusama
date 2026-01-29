import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // Add other user fields
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...updates } });
        }
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // storage key
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
