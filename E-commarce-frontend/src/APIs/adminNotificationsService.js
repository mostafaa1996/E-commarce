import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;
export async function getAdminNotifications() {
  const res = await authFetch(`${URL}/admin/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch admin notifications data");
  }
  console.log(data);
  return data;
}

export async function updateAdminNotificationStatus(id) {
  const res = await authFetch(`${URL}/admin/notifications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.data = data;
    throw error;
  }

  console.log(data);
  return data;
}

export async function updateAllAdminNotificationStatus() {
  const res = await authFetch(`${URL}/admin/notifications/allNotifications`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.data = data;
    throw error;
  }

  console.log(data);
  return data;
}

export async function getImportantUnreadNotificationsNumber() {
  const res = await authFetch(`${URL}/admin/notifications/ImportantUnreadNotificationsNumber`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.data = data;
    throw error;
  }

  console.log(data);
  return data;
}
