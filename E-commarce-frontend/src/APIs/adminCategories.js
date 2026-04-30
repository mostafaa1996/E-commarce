import { authFetch } from "./AuthFetch";

const URL = import.meta.env.VITE_API_URL;

export async function getAdminCategories() {
  const res = await authFetch(`${URL}/admin/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin categories data");
  }
  const data = await res.json();
  // console.log(data);
  return data.categories;
}

export async function createAdminCategory(category) {
  const res = await authFetch(`${URL}/admin/categories`, {
    method: "POST",
    body: category,
  });
  if (!res.ok) {
    throw new Error("Failed to add category");
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function deleteAdminCategory(id) {
  console.log(id);
  const res = await authFetch(`${URL}/admin/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete category");
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function updateAdminCategory(id, category) {
  const res = await authFetch(`${URL}/admin/categories/${id}`, {
    method: "PUT",
    body: category,
  });
  if (!res.ok) {
    throw new Error("Failed to update category");
  }
  const data = await res.json();
  console.log(data);
  return data;
}
