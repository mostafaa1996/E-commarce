import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;
export async function getAdminOrders(query) {
  console.log(query);
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const API_Link = `${URL}/admin/orders?${params.toString()}`;
  
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

export async function getAdminOrder(id) {
  const res = await authFetch(`${URL}/admin/orders/${id}`, {
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

export async function updateAdminOrder(id, order) {
  const res = await authFetch(`${URL}/admin/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin dashboard data");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}