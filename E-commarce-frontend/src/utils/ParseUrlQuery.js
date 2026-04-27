import { createSearchParams } from "react-router-dom";

function parseNumberOrDefault(value, defaultValue) {
  if (value === null || value === "") {
    return defaultValue;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
}

// parse url query
// input: searchParams from useSearchParams hook
// output: query object
export function parseURLQuery(searchParams, defaultURLQuery) {
  const query = {};
  const keys = Object.keys(defaultURLQuery);

  for (const key of keys) {
    const defaultValue = defaultURLQuery[key];

    if (Array.isArray(defaultValue)) {
      query[key] = searchParams.getAll(key);
      continue;
    }

    const searchValue = searchParams.get(key);

    if (typeof defaultValue === "number") {
      query[key] = parseNumberOrDefault(searchValue, defaultValue);
      continue;
    }

    query[key] = searchValue || defaultValue;
  }

  return query;
}


// build url search params
// input: query object
// output: searchParams
export function buildURLQueryParams(query) {
  const clean = {};

  Object.entries(query).forEach(([key, value]) => {
    if (value == null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length) {
        clean[key] = value;
      }
      return;
    }

    clean[key] = String(value);
  });

  return createSearchParams(clean);
}

// parse shop query from url
// input: requestUrl
// output: query object
export function parseShopQueryFromUrl(requestUrl , defaultURLQuery) {
    const url = new URL(requestUrl);
    const query = parseURLQuery(url.searchParams, defaultURLQuery);
    return query;
}
