import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { parseShopQuery, buildShopQueryParams } from "../utils/ParseShopQuery";
export const defaultShopQuery = {
  page: 1,
  limit: 9,
  sort: "default",
  category: null,
  tags: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
};

const useShopQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shopQuery = useMemo(() => parseShopQuery(searchParams), [searchParams]);

  function updateShopQuery(UpdatedQuery) {
    const query = {
      ...shopQuery,
      ...UpdatedQuery,
      page: UpdatedQuery.page ? UpdatedQuery.page : 1,
    };

    setSearchParams(buildShopQueryParams(query));
  }

  function resetShopQuery() {
    setSearchParams(buildShopQueryParams(defaultShopQuery));
  }
  function ExistInQuery(key, value) {
    // console.log(key, value);
    return Array.isArray(shopQuery[key])
      ? shopQuery[key].includes(value)
      : shopQuery[key] === value;
  }
  return { shopQuery, updateShopQuery, resetShopQuery, ExistInQuery };
};

export default useShopQuery;
