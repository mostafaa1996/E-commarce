import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isAuthReady: false,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
      isAuthReady: true,
    }),

  logoutUser: () =>
    set({
      user: null,
      isLoggedIn: false,
      isAuthReady: true,
    }),
}));