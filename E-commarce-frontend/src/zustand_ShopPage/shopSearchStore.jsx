import { create } from "zustand";

export const useShopSearchStore = create((set) => ({
  searchValue : "",
  submittedSearchValue : "",
  setShopSearchValue : (value) => set({searchValue : value}),
  setSubmittedSearchValue : (value) => set({submittedSearchValue : value}),
}));
