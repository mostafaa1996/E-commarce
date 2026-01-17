import { create } from "zustand";

export const useshopResponseStore = create((set) => ({
  shopResponse: {
    currentPage: 0,
    totalPages: 0,
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
        products: data.products,
        CategoriesArray : data.Category,
        BrandsArray: data.brands,
        TagsArray: data.tags,
        PriceLimitsArray: data.price,
      },
    })),
}));
