import { getCartData } from "@/APIs/checkoutService";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

export default function useCheckoutPage() {
  const initialData = useLoaderData();
  const [orderNotes, setOrderNotes] = useState("");
  const [shippingDetailsModified] = useState(null);
  const { orderState } = useCheckoutStore();

  const checkoutQuery = useQuery({
    queryKey: ["checkout"],
    queryFn: async () => {
      const { cart, VAT_shipping, message: cartMessage } = await getCartData();
      return {
        cart,
        VAT_shipping,
        cartMessage,
      };
    },
    initialData,
  });

  function setNotes(event) {
    setOrderNotes(event.target.value);
  }

  return {
    checkoutData: checkoutQuery.data,
    isLoading: checkoutQuery.isLoading,
    checkoutError: checkoutQuery.error,
    orderState,
    orderNotes,
    shippingDetailsModified,
    setNotes,
  };
}
