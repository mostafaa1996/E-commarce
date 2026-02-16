import { authFetch } from "./AuthFetch";

const DevelopmentURL = "http://localhost:3000";
// get user contact details
// get user order history
// get user wishlist
// get user addresses
export async function getUserProfileData() {
  const res = await authFetch(`${DevelopmentURL}/user/profile` , 
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  );
  if(!res.ok) {
    throw new Error("Failed to fetch user profile data");
  }
  const data = await res.json();
  return data;  
}