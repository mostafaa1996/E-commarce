import { useEffect } from "react";
import { setAccessToken } from "@/APIs/AuthFetch";
import { useAuthStore } from "@/zustand_auth/authStore";

const URL = import.meta.env.VITE_API_URL;

export default function AuthInitializer({ children }) {
  const { setUser, logoutUser } = useAuthStore();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          setAccessToken(null);
          logoutUser();
          return;
        }

        const data = await res.json();

        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch (error) {
        console.error(error);
        setAccessToken(null);
        logoutUser();
      }
    }

    checkAuth();
  }, [setUser, logoutUser]);

  return children;
}