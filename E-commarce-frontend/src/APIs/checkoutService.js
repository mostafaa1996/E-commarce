import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;

export async function getCartData(navigationState) {
  let res = null;
  const { product } = navigationState || {};
  if (product) {
    res = await authFetch(
      `${URL}/checkout/BuyNow?productId=${product.productId}&variantId=${product.variantId}&quantity=${product.quantity}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } else {
    res = await authFetch(`${URL}/checkout/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const checkout = await res.json();

  if (!res.ok) {
    console.error(checkout.message || "Failed to fetch checkout");
  }

  console.log(checkout);

  return checkout;
}

export async function placeOrder({ orderNotes, selectedCard, paymentType, cartId }) {
  const res = await authFetch(`${URL}/order/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderNotes, selectedCard, paymentType, cartId }),
  });
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.data = data;
    throw error;
  }

  console.log(data.nextAction);

  return data;
}
