import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;
export async function getAdminProducts(query) {
  console.log(query);
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const API_Link = `${URL}/admin/products?${params.toString()}`;
  
  const res = await authFetch(API_Link , {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin dashboard data");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function getProduct(id) {
  const res = await authFetch(`${URL}/admin/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }
  const data = await res.json();
  console.log(data);
  return data.product;
}

export async function createProduct(product) {
  const res = await authFetch(`${URL}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    throw new Error("Failed to add product");
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function updateProduct(id, product) {
  console.log(product , id);
  const res = await authFetch(`${URL}/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    throw new Error("Failed to update product");
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function deleteProduct(id) {
  const res = await authFetch(`${URL}/admin/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
  const data = await res.json();
  console.log(data);
  return data;
}
