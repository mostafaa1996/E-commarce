import { authFetch } from "./AuthFetch";
import { useCartStore } from "../zustand_Cart/CartStore";
export async function CartService() {
  
  const guestCart = localStorage.getItem("cart-storage");
  const parsed = guestCart ? JSON.parse(guestCart) : null;

  if (!parsed || parsed.state.items.length === 0) {
    // get database cart
    const res = await authFetch("http://localhost:3000/cart/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cart");
    }

    const cart = await res.json();

    console.log(cart);

    useCartStore.getState().setCart(cart);
  } else {
    // Update database cart
    console.log("Update database cart with guest cart");
    await authFetch("http://localhost:3000/cart/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: guestCart,
    });
  }

  return null;
}

export async function syncCart() {
  const guestCart = localStorage.getItem("cart-storage");
  const parsed = guestCart ? JSON.parse(guestCart) : null;

  if (parsed) {
    // Update database cart
    console.log("Update database cart with guest cart");
    await authFetch("http://localhost:3000/cart/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: guestCart,
    });
  }
}
