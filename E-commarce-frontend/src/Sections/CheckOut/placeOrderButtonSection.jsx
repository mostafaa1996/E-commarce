import { useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "@/components/genericComponents/Button";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/APIs/checkoutService";

export default function CheckoutPaymentSection({ orderNotes }) {
  const stripe = useStripe();
  const elements = useElements();
  const {
    PaymentMethodState,
    setOrderState,
    selectedCard,
    paymentType,
    setOrderId,
  } = useCheckoutStore();

  const OrderMutation = useMutation({
    mutationFn: ({ orderNotes, selectedCard, paymentType }) => {
      return placeOrder({
        orderNotes,
        selectedCard,
        paymentType,
      });
    },
    onMutate: () => {
      setOrderState("Loading");
    },
    onSuccess: async(data) => {
      if (data.nextAction === "requires_action") {
        const result = await stripe.handleNextAction({
          clientSecret: data.clientSecret,
        });
        if (result.error) {
          setOrderState("failed");
        }
        setOrderId(data.orderNumber);
        setOrderState(result.paymentIntent?.status || "pending_payment");
        return;
      }
      setOrderId(data.orderNumber);
      setOrderState(data.nextAction);
    },
    onError: (error) => {
      if (error.data?.blocked) {
        setOrderState("userBlocked");
      } else {
        setOrderState(error.data?.nextAction || "Error");
      }
    },
  });

  async function handlePlaceOrder() {
    await OrderMutation.mutateAsync({
      orderNotes,
      selectedCard,
      paymentType,
    });
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
