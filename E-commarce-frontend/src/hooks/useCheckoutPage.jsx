import { getCartData } from "@/APIs/checkoutService";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {useLocation} from "react-router-dom";

export default function useCheckoutPage() {
  const [orderNotes, setOrderNotes] = useState("");
  const { orderState } = useCheckoutStore();
  const {state} = useLocation(); //hold the info of buy now button

  const checkoutQuery = useQuery({
    queryKey: ["checkout"],
    queryFn: async () => {
      const response = await getCartData(state);
      console.log(response);
      return {
        cart: response.cart,
        message: response.message,
        blocked: response.blocked,
      };
    },
    staleTime: 0,
    refetchOnMount: "always",
    gcTime: 0,
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
