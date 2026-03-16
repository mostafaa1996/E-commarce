import { createSearchParams } from "react-router-dom";

// parse shop query
// input: searchParams from useSearchParams hook
// output: query object
export function parseShopQuery(searchParams) {
  return {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 9),
    sort: searchParams.get("sort") || "default",
    category: searchParams.get("category") || null,
    brands: searchParams.getAll("brands") || [],
    tags: searchParams.getAll("tags") || [],
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : null,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : null,
  };
}


// build shop search params
// input: query object
// output: searchParams
export function buildShopQueryParams(query) {
  const clean = {
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 9),
    sort: query.sort ?? "default",
  };

  if (query.category) clean.category = query.category;
  if (query.search) clean.search = query.search;
  if (query.minPrice != null) clean.minPrice = String(query.minPrice);
  if (query.maxPrice != null) clean.maxPrice = String(query.maxPrice);
  if (query.brands?.length) clean.brands = query.brands;
  if (query.tags?.length) clean.tags = query.tags;

  return createSearchParams(clean);
}

// parse shop query from url
// input: requestUrl
// output: query object
export function parseShopQueryFromUrl(requestUrl) {
  const url = new URL(requestUrl);

  return {
    page: Number(url.searchParams.get("page") || 1),
    limit: Number(url.searchParams.get("limit") || 9),
    sort: url.searchParams.get("sort") || "default",
    category: url.searchParams.get("category") || null,
    tags: url.searchParams.getAll("tags"),
    brands: url.searchParams.getAll("brands"),
    minPrice: url.searchParams.get("minPrice")
      ? Number(url.searchParams.get("minPrice"))
      : null,
    maxPrice: url.searchParams.get("maxPrice")
      ? Number(url.searchParams.get("maxPrice"))
      : null,
  };
}