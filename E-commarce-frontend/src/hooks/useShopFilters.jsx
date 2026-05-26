import { useCallback } from "react";
import { defaultShopQuery } from "@/Data/shopQuery";
import useURLQuery from "./UrlQuery";

export default function useShopFilters() {
  const { MainQuery, updateUrlQuery, resetUrlQuery, ExistInQuery } =
    useURLQuery(defaultShopQuery);

  const toggleArrayFilter = useCallback(
    (key, item) => {
      const currentValues = Array.isArray(MainQuery[key]) ? MainQuery[key] : [];
      const nextValues = currentValues.includes(item)
        ? currentValues.filter((value) => value !== item)
        : [...currentValues, item];

      updateUrlQuery({ [key]: nextValues });
    },
    [MainQuery, updateUrlQuery],
  );

  const toggleSingleFilter = useCallback(
    (key, item) => {
      updateUrlQuery({
        [key]: MainQuery[key] === item ? null : item,
      });
    },
    [MainQuery, updateUrlQuery],
  );

  const toggleCategoryFilter = useCallback(
    (category) => {
      if (MainQuery.category === category) {
        resetUrlQuery(defaultShopQuery);
        return;
      }

      updateUrlQuery({ category });
    },
    [MainQuery.category, resetUrlQuery, updateUrlQuery],
  );

  const toggleBooleanFilter = useCallback(
    (key) => {
      updateUrlQuery({ [key]: !MainQuery[key] });
    },
    [MainQuery, updateUrlQuery],
  );

  const setPriceFilter = useCallback(
    ({ minPrice, maxPrice }) => {
      updateUrlQuery({ minPrice, maxPrice });
    },
    [updateUrlQuery],
  );

  const resetFilters = useCallback(() => {
    resetUrlQuery(defaultShopQuery);
  }, [resetUrlQuery]);

  return {
    shopQuery: MainQuery,
    toggleArrayFilter,
    toggleSingleFilter,
    toggleCategoryFilter,
    toggleBooleanFilter,
    setPriceFilter,
    resetFilters,
    isFilterSelected: ExistInQuery,
  };
}
