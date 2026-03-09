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
