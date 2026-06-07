import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
    }),

  logoutUser: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),
}));