import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { parseURLQuery, buildURLQueryParams } from "../utils/ParseUrlQuery";
import { useCallback } from "react";

const useURLQuery = (defaultQuery) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const MainQuery = useMemo(
    () => parseURLQuery(searchParams, defaultQuery),
    [defaultQuery, searchParams],
  );

  const updateUrlQuery = useCallback(
    (UpdatedQuery) => {
      const query = {
        ...MainQuery,
        ...UpdatedQuery,
        page: UpdatedQuery.page ?? 1,
      };
      setSearchParams(buildURLQueryParams(query));
    },
    [MainQuery, setSearchParams],
  );

  const resetUrlQuery = useCallback(
    (defaultQuery) => {
      setSearchParams(buildURLQueryParams(defaultQuery));
    },
    [setSearchParams],
  );
  function ExistInQuery(key, value) {
    // console.log(key, value);
    return Array.isArray(MainQuery[key])
      ? MainQuery[key].includes(value)
      : MainQuery[key] === value;
  }
  return { MainQuery, updateUrlQuery, resetUrlQuery, ExistInQuery };
};

export default useURLQuery;
