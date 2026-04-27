import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { parseURLQuery, buildURLQueryParams } from "../utils/ParseUrlQuery";


const useURLQuery = (defaultQuery) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const MainQuery = useMemo(
    () => parseURLQuery(searchParams, defaultQuery),
    [defaultQuery, searchParams],
  );

  function updateUrlQuery(UpdatedQuery) {
    const query = {
      ...MainQuery,
      ...UpdatedQuery,
      page: UpdatedQuery.page ? UpdatedQuery.page : 1,
    };

    setSearchParams(buildURLQueryParams(query));
  }

  function resetUrlQuery(defaultQuery) {
    setSearchParams(buildURLQueryParams(defaultQuery));
  }
  function ExistInQuery(key, value) {
    // console.log(key, value);
    return Array.isArray(MainQuery[key])
      ? MainQuery[key].includes(value)
      : MainQuery[key] === value;
  }
  return { MainQuery, updateUrlQuery, resetUrlQuery, ExistInQuery };
};

export default useURLQuery;
