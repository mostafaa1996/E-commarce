import { create } from "zustand";

export const useShopQueryStore = create(set => ({
  shopQuery: {
    page: 1,
    limit: 9,
    search: "",
    category: null,
    brands: [],
    tags: [],
    minPrice: null,
    maxPrice: null,
    sort: null
  },

  setQuery: (type, value) =>
    set(state => ({
      shopQuery: {
        ...state.shopQuery,
        [type]: value,
        page: type !== "page" ? 1 : value
      }
    })),

  getBrands : () => {
    const state = useShopQueryStore.getState();
    return state.shopQuery.brands;
  },

  getTags : () => {
    const state = useShopQueryStore.getState();
    return state.shopQuery.tags;
  },

}));

