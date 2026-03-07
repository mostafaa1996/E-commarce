import { useCartStore } from "../zustand_Cart/CartStore";
import { useCheckoutStore } from "../zustand_checkout/checkoutStore";
import { authFetch } from "./AuthFetch";
const URL = import.meta.env.VITE_API_URL;

export async function checkoutLoader() {
  const res = await authFetch(`${URL}/checkout/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch checkout");
  }

  const checkout = await res.json();

  console.log(checkout);

  //res => {shippingDetails , paymentMethod}
  useCheckoutStore.getState().setShippingDetails(checkout.shippingDetails);
  useCheckoutStore.getState().setCartInfo(useCartStore.getState().getCart());

  return checkout;
}

export async function checkoutAction() {
  
  const res = await authFetch(
    `${URL}/order/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shippingDetails: useCheckoutStore.getState().ShippingDetails,
        cartInfo : useCheckoutStore.getState().CartInfo,
        orderNotes : useCheckoutStore.getState().OrderNotes,
        paymentMethod : useCheckoutStore.getState().PaymentMethod,
        shippingDetailsmodified : useCheckoutStore.getState().shippingDetailsmodified,
        cardForm : useCheckoutStore.getState().CardForm || {},
      }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to update shipping details in database");
  } 
  
  const data = await res.json();
  if(data.nextAction === "orderPlaced") {
    useCheckoutStore.getState().setCurrentState("OrderPlaced");
    useCheckoutStore.getState().setServerResponse(data);
  }
  console.log(data.nextAction);
  
  return null;
  
}

export async function fetchCards() {
    const res = await authFetch(
    `${URL}/order/savedCards`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to update shipping details in database");
  } 
  
  const data = await res.json(); 

  //res => {message , nextAction , savedCards}
  console.log(data);
  useCheckoutStore.getState().setServerResponse(data);
  useCheckoutStore.getState().setCurrentState(data.nextAction || "");

  return data;
}
