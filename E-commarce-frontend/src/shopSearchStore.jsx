import { create } from "zustand";


export const useShopSearchStore = create((set) => ({
  shopSearch: {
    searchValue: "",
    products: [],
  },

  setShopSearchProducts: (products) =>
    set((state) => ({
      shopSearch: { ...state.shopSearch, products },
    })),

  setShopSearchValue: (value) =>
    set((state) => ({
      shopSearch: { ...state.shopSearch, searchValue: value },
    })),
}));
