import { create } from "zustand";

interface AuthState {
  username: { name: string } | null;
  setUser: (username: { name: string }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  setUser: (username) => set({ username }),
}));
