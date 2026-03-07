import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;
import { useCurrencyStore } from "@/zustand_preferences/currency";

export async function getExchangeRate() {
   const res = await authFetch(
       `${URL}/exchangeRate/`,
       {
           method: "GET",
           headers: {
               "Content-Type": "application/json",
           },
       },
   ) 
   if (!res.ok) {
       throw new Error("Failed to fetch exchange rate");
   }
   const data = await res.json();
   useCurrencyStore.setState({ conversion_rate: data });
   console.log(data);
   return data;
}