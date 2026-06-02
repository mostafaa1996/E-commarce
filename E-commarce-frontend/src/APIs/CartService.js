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
  if (cart.message === "Cart not found" || cart.message === "Unauthorized") {
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

export async function syncCart({
  ActionType,
  productId,
  variantId,
  quantity,
  code,
}) {
  let res = null;
  if (ActionType === "updateQuantity") {
    res = await authFetch(`${URL}/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, variantId, quantity }),
    });

    if (!res.ok) {
      throw new Error("Failed to update cart");
    }
  }

  if (ActionType === "clear") {
    res = await authFetch(`${URL}/cart/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete cart");
    }
  }

  if (ActionType === "remove") {
    console.log("remove item");
    res = await authFetch(
      `${URL}/cart/${productId}?variantId=${encodeURIComponent(variantId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to delete cart");
    }
  }

  if (ActionType === "applyPromo") {
    res = await authFetch(`${URL}/cart/applyPromo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promoCode: code }),
    });

    if (!res.ok) {
      throw new Error("Failed to apply promo");
    }
  }

  const data = await res.json();
  console.log(data);
  return data;
}

export async function getCartPage() {
  const res = await authFetch(`${URL}/cart/cartPage`, {
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
  return cart;
}
