import { getCartData } from "@/APIs/checkoutService";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

export default function useCheckoutPage() {
  const initialData = useLoaderData();
  const [orderNotes, setOrderNotes] = useState("");
  const { orderState } = useCheckoutStore();

  const checkoutQuery = useQuery({
    queryKey: ["checkout"],
    queryFn: async () => {
      const { cart, message: cartMessage } = await getCartData();
      return {
        cart,
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
    setNotes,
  };
}
