const URL = import.meta.env.VITE_API_URL;
export async function getShopProducts(shopQuery) {
  const API_Link =`${URL}/shop/products?${new URLSearchParams(shopQuery).toString()}`;
  console.log(API_Link);
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
  return data;
}


export async function getProductById(id) {
  const API_Link = `${URL}/shop/products/${id}` ;
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
};
