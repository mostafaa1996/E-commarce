import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;

export async function getCartData() {
  const res = await authFetch(`${URL}/checkout/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const checkout = await res.json();

  if (!res.ok) {
    throw new Error(checkout.message || "Failed to fetch checkout");
  }

  return checkout;
}

export async function placeOrder({
  cart,
  shippingDetails,
  orderNotes,
  selectedCard,
}) {
  const res = await authFetch(`${URL}/order/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cart, shippingDetails, orderNotes, selectedCard }),
  });
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  console.log(data.nextAction);

  return data;
}

export async function getShippingDetails() {
  const res = await authFetch(`${URL}/checkout/shippingDetails`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch checkout");
  }

  const shippingDetails = await res.json();
  return shippingDetails;
}
