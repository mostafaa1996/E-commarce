import { create } from "zustand";
import {defaultShopQuery} from "./shopDefaultQuery";

export const useShopQueryStore = create((set) => ({
  shopQuery: defaultShopQuery,

  setShopQuery: (type, value) =>
    set((state) => ({
      shopQuery: {
        ...state.shopQuery,
        [type]: value,
        page: type !== "page" ? 1 : value,
      },
    })),

  getBrands: () => {
    const state = useShopQueryStore.getState();
    return state.shopQuery.brands;
  },

  getTags: () => {
    const state = useShopQueryStore.getState();
    return state.shopQuery.tags;
  },
}));
