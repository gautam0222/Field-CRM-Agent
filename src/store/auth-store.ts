import { create } from "zustand"

interface AuthState {
  userId: string | null
  email: string | null
  setUser: (user: { id: string; email?: string | null } | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  setUser: (user) =>
    set({
      userId: user?.id ?? null,
      email: user?.email ?? null,
    }),
  clearUser: () => set({ userId: null, email: null }),
}))
