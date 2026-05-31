import { useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "@/components/genericComponents/Button";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/APIs/checkoutService";

export default function CheckoutPaymentSection({ orderNotes }) {
  const stripe = useStripe();
  const elements = useElements();
  const { PaymentMethodState, setOrderState, selectedCard } =
    useCheckoutStore();

  const OrderMutation = useMutation({
    mutationFn: ({ orderNotes, selectedCard }) => {
      return placeOrder({
        orderNotes,
        selectedCard,
      });
    },
    onMutate: () => {
      setOrderState("Loading");
    },
    onError: (error) => {
      if (error.data?.blocked) {
        setOrderState("userBlocked");
      } else {
        setOrderState("Error");
      }
    },
  });

  async function handlePlaceOrder() {
    const res = await OrderMutation.mutateAsync({
      orderNotes,
      selectedCard,
    });

    if (res.nextAction === "requires_action") {
      const result = await stripe.handleNextAction({
        clientSecret: res.clientSecret,
      });
      if (result.error) {
        setOrderState("Error");
      }
      setOrderState("pending_payment");
      return;
    }
    setOrderState(res.nextAction);
  }

  return (
    <Button
      className="w-fit tracking-widest"
      type="button"
      disabled={PaymentMethodState === "AddingNewCard"}
      onClick={handlePlaceOrder}
    >
      PLACE AN ORDER
    </Button>
  );
}
