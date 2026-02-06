let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
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
    const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Unauthorized");
    }
    
    const data = await refreshRes.json();
    accessToken = data.accessToken;

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
