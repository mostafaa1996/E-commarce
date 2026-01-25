import { create } from "zustand";
import { defaultProductDetailsQuery } from "./ProductDetailsDefaultQuery";

export const useProductDetailsQueryStore = create((set) => ({
  ProductDetailsQuery: defaultProductDetailsQuery,

  setProductDetailsQuery: (type, value) =>
    set((state) => ({
      ProductDetailsQuery: {
        ...state.ProductDetailsQuery,
        [type]: value,
      },
    })),
}));
