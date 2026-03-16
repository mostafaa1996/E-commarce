export const OrderStatesUIData = [
  // orderPlaced by cod
  {
    state: "orderPlaced",
    header: "Order Confirmed!",
    IconName: "packageCheck",
    message:
      "Your order has been placed successfully. You will pay in cash upon delivery.",
  },
  // pending_payment
  {
    state: "pending_payment",
    header: "Pending Payment",
    IconName: "clock",
    message:
      "Your order was created, but the payment is still pending. Please complete the payment to finalize your order.",
  },

  // paid
  {
    state: "paid",
    header: "Payment Successful!",
    IconName: "badgeCheck",
    message:
      "Your payment was successful and your order is now confirmed. We'll start processing it shortly.",
  },

  // payment_failed
  {
    state: "payment_failed",
    header: "Payment Failed!",
    IconName: "circleX",
    message:
      "We couldn't process your payment. Please check your card details or try another payment method.",
  },

  // cancelled
  {
    state: "cancelled",
    header: "Order Cancelled",
    IconName: "ban",
    message:
      "This order has been cancelled. If this was a mistake, you can place the order again anytime.",
  },

  // loading
  {
    state: "Loading",
    header: "Processing...",
    IconName: "loader2",
    message:
      "Please wait while we process your order and confirm the payment.",
  },

  // error
  {
    state: "Error",
    header: "Something went wrong",
    IconName: "triangleAlert",
    message:
      "Something went wrong while processing your order. Please try again or contact support if the issue persists.",
  },
];
