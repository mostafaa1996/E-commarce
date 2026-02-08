import { useCartStore } from "../zustand_Cart/CartStore";
import { useCheckoutStore } from "../zustand_checkout/checkoutStore";
import { authFetch } from "./AuthFetch";

export async function checkoutLoader() {
   const res = await authFetch("http://localhost:3000/checkout/", {
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
   useCheckoutStore.getState().setPaymentMethod(checkout.paymentMethod);
   useCheckoutStore.getState().setCartInfo(useCartStore.getState().getCart());

   return checkout;
}