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
  pushSelectedFilter: (item , title) =>{
    if(title === "price" || title === "category"){
      set((state) => ({
      SelectedFilterArray: state.SelectedFilterArray.filter((i) => i.title !== title),
      }));
    }
    return set((state) => ({
      SelectedFilterArray: [...state.SelectedFilterArray, {item , title}],
    }));
  },
    
  //remove value from SelectedFilterArray
  removeSelectedFilter: (item , title) =>
    set((state) => ({
      SelectedFilterArray: state.SelectedFilterArray.filter((i) => i.item !== item && i.title !== title),
    })),
  
  //reset shopQuery and SelectedFilterArray
  resetAll: () =>
    set(() => ({
      shopQuery: defaultShopQuery,
      SelectedFilterArray: [],
    })),
}));
