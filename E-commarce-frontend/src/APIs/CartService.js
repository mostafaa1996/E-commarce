import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;
export async function getCart() {
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
  if (cart.message === "Cart not found") {
    return {
      items: [], //[{ _id, title, price, quantity, image, subtotal }],
      totalItems: 0,
      totalPrice: 0,
      createdAt: "",
      updatedAt: "",
    };
  }

  return cart;
}

export async function syncCart({ ActionType, id, quantity }) {
  if (ActionType === "add") {
    console.log("add");
    const res = await authFetch(`${URL}/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, quantity }),
    });

    if (!res.ok) {
      throw new Error("Failed to update cart");
    }

    const data = await res.json();
    console.log(data);
    return data;
  }

  if (ActionType === "clear") {
    console.log("clear");
    const res = await authFetch(`${URL}/cart/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete cart");
    }

    const data = await res.json();
    console.log(data);
    return data;
  }

  if (ActionType === "remove") {
    console.log("remove item");
    const res = await authFetch(`${URL}/cart/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete cart");
    }

    const data = await res.json();
    console.log(data);
    return data;
  }

  return null;
}
