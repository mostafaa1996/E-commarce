const URL = import.meta.env.VITE_API_URL;
let accessToken = null;
import { useAuthStore } from "@/zustand_auth/authStore";

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export async function authFetch(url, options = {}) {
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
    },
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshRes = await fetch(`${URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Unauthorized");
    }
    
    const data = await refreshRes.json();
    setAccessToken(data.accessToken);
    useAuthStore.getState().setUser(data.user);

    console.log(accessToken);

    // retry original request
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
  }

  return res;
}
