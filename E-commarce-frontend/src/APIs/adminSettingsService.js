import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;
export async function getAdminSettings() {
  const res = await authFetch(`${URL}/admin/settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin settings data");
  }
  const data = await res.json();
  console.log(data);
  return data.settings;
}

export async function getAdminUserForTopBar() {
  const res = await authFetch(`${URL}/admin/settings/TopBarInfo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin settings data");
  }
  const data = await res.json();
  console.log(data);
  return data.topBarInfo;
}

export async function updateAdminProfile(profileData) {
  const formData = new FormData();

  Object.entries(profileData).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (key === "image" && value instanceof File) {
      formData.append("image", value);
      return;
    }

    formData.append(key, value);
  });

  const res = await authFetch(`${URL}/admin/settings/profile`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin settings data");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function updateAdminStore(settings) {
  const res = await authFetch(`${URL}/admin/settings/store`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin settings data");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}

export async function updateAdminPassword(passwordData) {
  const res = await authFetch(`${URL}/admin/settings/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch admin settings data");
  }
  const data = await res.json();
  // console.log(data);
  return data;
}
