import { create } from "zustand";


export const useShopSortingStore = create((set) => ({
  shopSorting: {
    trigger: false,
    SortingArray: [],
  },

  setShopSortingArray: (SortingArray) =>
    set((state) => ({
      shopSorting: { ...state.shopSorting, SortingArray },
    })),

  setShopSortingTrigger: (trigger) =>
    set((state) => ({
      shopSorting: { ...state.shopSorting, trigger },
    })),
}));