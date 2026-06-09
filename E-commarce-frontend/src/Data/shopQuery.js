export const defaultShopQuery = {
  page: 1,
  limit: 9,
  sort: "default",
  search: null,
  category: null,
  tags: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
  onDeal: false,
  topRated: false,
  bestSeller: false,
};

export const sortingArray = [
  "price-asc",
  "price-desc",
  "newest",
  "oldest",
  "rating",
  "Alphabetical",
  "ReverseAlphabetical",
  "Default sorting",
];