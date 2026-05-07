import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;
export async function getAdminProductsReviews(query) {
  console.log(query);
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const API_Link = `${URL}/admin/reviews?${params.toString()}`;
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
  // console.log(data);
  return data;
}
export async function updateAdminProductReview(id, status) {
  const res = await authFetch(`${URL}/admin/reviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin dashboard data");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}
export async function deleteAdminProductReview(id) {
  const res = await authFetch(`${URL}/admin/reviews/${id}`, {
    method: "DELETE",
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
