import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;
export async function getAdminActivityLog (){
    const res = await authFetch(`${URL}/admin/activity-logs`, {
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
      return data.logs;
}