import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;
export async function getAdminCustomers(query) {
  console.log("query>>>>>>>>" , query);
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const API_Link = `${URL}/admin/customers?${params.toString()}`;
  const res = await authFetch(API_Link, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin dashboard data");
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function getAdminCustomer(id) {
  const res = await authFetch(`${URL}/admin/customers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin dashboard data");
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function updateAdminCustomerStatus(id, status) {
  const res = await authFetch(`${URL}/admin/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error("Failed to update customer status");
  }
  const data = await res.json();
  return data;
}

