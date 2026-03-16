import { useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "@/components/genericComponents/Button";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/APIs/checkoutService";

export default function CheckoutPaymentSection({
  cart,
  shippingDetailsModified,
  orderNotes,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { PaymentMethodState, setOrderState, selectedCard } =
    useCheckoutStore();

  const OrderMutation = useMutation({
    mutationFn: ({ cart, shippingDetails, orderNotes, selectedCard }) => {
      return placeOrder({
        cart,
        shippingDetails,
        orderNotes,
        selectedCard,
      });
    },
    onMutate: () => {
      setOrderState("Loading");
    },
    onError: () => {
      setOrderState("Error");
    },
  });

  async function handlePlaceOrder() {
    // console.log(shippingDetailsModified);
    const res = await OrderMutation.mutateAsync({
      cart: cart.products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
      })),
      shippingDetails: shippingDetailsModified,
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
