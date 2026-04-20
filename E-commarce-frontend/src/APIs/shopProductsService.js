import { authFetch } from "./AuthFetch";

const URL = import.meta.env.VITE_API_URL;
export async function getShopProducts(shopQuery) {
  // console.log(shopQuery);

  const params = new URLSearchParams();

  Object.entries(shopQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const API_Link = `${URL}/shop/products?${params.toString()}`;
  // console.log(API_Link);
  const response = await fetch(API_Link, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load products");
  }
  // console.log(data);
  return data;
}

export async function getProductById(id) {
  const API_Link = `${URL}/shop/products/${id}`;
  console.log(API_Link);
  const response = await fetch(API_Link, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load product");
  }
  return data.product;
}

export async function getRelatedProductsForProductById(product) {
  const requests = [
    product.brand
      ? getShopProducts({ brands: product.brand, limit: 8 })
      : Promise.resolve({ products: [] }),
    Array.isArray(product.tags) && product.tags.length > 0
      ? getShopProducts({ tags: product.tags.slice(0, 3), limit: 8 })
      : Promise.resolve({ products: [] }),
  ];

  const [brandResponse, tagsResponse] = await Promise.all(requests);

  const relatedProducts = [...brandResponse.products, ...tagsResponse.products]
    .filter((item) => item._id !== product._id)
    .filter(
      (item, index, items) =>
        items.findIndex((candidate) => candidate._id === item._id) === index,
    )
    .slice(0, 4);

  return relatedProducts;
};

export async function addProductReview({ id, rating, comment }) {
  const API_Link = `${URL}/shop/products/${id}/reviews`;
  console.log(API_Link);
  const response = await authFetch(API_Link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating, comment }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to add review");
  }
  console.log(data);
  return data;
}

export async function getLimitedSearchedProducts(searchQuery) {
  const API_Link = `${URL}/shop/products/search/limited?${new URLSearchParams(
    searchQuery,
  ).toString()}`;
  console.log(API_Link);
  const response = await fetch(API_Link, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(data.message || "Failed to load products");
  }
  const data = await response.json();
  // console.log(data);
  return data;
}

export async function getSearchedProducts(searchQuery) {
  const API_Link = `${URL}/shop/products/search?${new URLSearchParams(
    searchQuery,
  ).toString()}`;
  console.log(API_Link);
  const response = await fetch(API_Link, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(data.message || "Failed to load products");
  }
  const data = await response.json();
  // console.log(data);
  return data;
}
