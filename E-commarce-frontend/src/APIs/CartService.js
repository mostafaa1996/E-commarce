import { authFetch } from "./AuthFetch";
import { useCartStore } from "@/zustand_Cart/CartStore";
const URL = import.meta.env.VITE_API_URL;
export async function getCart() {
  //get local cart from zustand
  const guestCart = useCartStore.getState().getCart();
  console.log(guestCart , guestCart.items.length);
  const parsed =
    guestCart && guestCart.items.length > 0 ? guestCart : null;

  if (parsed === null) {
    // get database cart
    const res = await authFetch(`${URL}/cart/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cart");
    }

    const cart = await res.json();

    console.log(cart);

    useCartStore.getState().setCart(cart);

    return cart;
  }

  return parsed;
}

export async function syncCart({ActionType}) {
  const guestCart = useCartStore.getState().getCart();
  const parsed =
    guestCart && guestCart.items.length > 0 ? JSON.parse(guestCart) : null;

  if (parsed && ActionType === "update") {
    // Update database cart
    console.log("Update database cart with guest cart");
    const res = await authFetch(`${URL}/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: guestCart,
    });

    if (!res.ok) {
      throw new Error("Failed to update cart");
    }

    const data = await res.json();
    console.log(data);
    return data;
  }

  return null;
}
