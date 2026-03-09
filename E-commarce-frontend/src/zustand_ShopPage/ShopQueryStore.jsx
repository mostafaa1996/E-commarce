import { create } from "zustand";
import {defaultShopQuery} from "./shopDefaultQuery";

export const useShopQueryStore = create((set) => ({
  shopQuery: defaultShopQuery,
  SelectedFilterArray: [],
  setShopQuery: (type, value) =>
    set((state) => ({
      shopQuery: {
        ...state.shopQuery,
        [type]: value,
        page: type !== "page" ? 1 : value,
      },
    })),
  //push value to SelectedFilterArray
  pushSelectedFilter: (value) =>
    set((state) => ({
      SelectedFilterArray: [...state.SelectedFilterArray, value],
    })),
  //remove value from SelectedFilterArray
  removeSelectedFilter: (value) =>
    set((state) => ({
      SelectedFilterArray: state.SelectedFilterArray.filter((item) => item !== value),
    })),
  
  //reset shopQuery and SelectedFilterArray
  resetAll: () =>
    set(() => ({
      shopQuery: defaultShopQuery,
      SelectedFilterArray: [],
    })),
}));
