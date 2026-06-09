import { create } from "zustand";

export const useShopSearchStore = create((set) => ({
  searchValue : "",
  setShopSearchValue : (value) => set({searchValue : value}),
}));
