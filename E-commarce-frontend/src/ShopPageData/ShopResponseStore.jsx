import { create } from "zustand";

export const useshopResponseStore = create((set) => ({
  shopResponse: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    products: [],
    CategoriesArray: [],
    BrandsArray: [],
    TagsArray: [],
    PriceLimitsArray: [],
  },

  setshopResponse: (data) =>
    set(() => ({
      shopResponse: {
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalItems,
        products: data.products,
        CategoriesArray : data.category,
        BrandsArray: data.brands,
        TagsArray: data.tags,
        PriceLimitsArray: data.price,
      },
    })),
}));
