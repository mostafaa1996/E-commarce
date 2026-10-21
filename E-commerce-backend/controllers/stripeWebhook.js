require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/Order");
const User = require("../models/User");
const PlaceOrderService = require("../services/PlaceOrderService");

async function refundFailedOrderFinalization(order, paymentIntent, error) {
  await PlaceOrderService.recordPaymentFailure(
    order._id,
    "failed",
    "paid",
    paymentIntent,
    error,
  );

  try {
    await PlaceOrderService.refundPaymentIntent(
      paymentIntent.id,
      order._id,
    );
  } catch (refundError) {
    console.error(
      `Automatic refund failed for order ${order._id}:`,
      refundError,
    );
    throw refundError;
  }

  await PlaceOrderService.recordPaymentFailure(
    order._id,
    "failed",
    "refunded",
    paymentIntent,
    error,
  );
}

exports.handleStripeWebhook = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send("Missing Stripe signature");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
          console.error("Missing orderId in payment_intent.succeeded metadata");
          await PlaceOrderService.refundPaymentIntent(
            paymentIntent.id,
            paymentIntent.id,
          );
          break;
        }

        const order = await Order.findById(orderId);
        if (!order) {
          console.error(
            `Order not found for succeeded payment. orderId=${orderId}`,
          );
          await PlaceOrderService.refundPaymentIntent(
            paymentIntent.id,
            orderId,
          );
          break;
        }
        if (
          order.status === "orderPlaced" ||
          order.paymentStatus === "refunded"
        ) {
          break;
        }

        if (
          order.paymentMethod !== "card" ||
          !order.paymentIntentId ||
          order.paymentIntentId !== paymentIntent.id
        ) {
          await refundFailedOrderFinalization(
            order,
            paymentIntent,
            new Error("Stripe payment intent did not match the order"),
          );
          break;
        }

        const expectedAmount = Math.round(order.totalPrice * 100);
        const paidAmount =
          paymentIntent.amount_received || paymentIntent.amount;
        if (
          paidAmount !== expectedAmount ||
          paymentIntent.currency?.toLowerCase() !== "usd"
        ) {
          await refundFailedOrderFinalization(
            order,
            paymentIntent,
            new Error("Stripe payment amount or currency did not match the order"),
          );
          break;
        }

        const user = await User.findById(order.userId);
        if (!user) {
          await refundFailedOrderFinalization(
            order,
            paymentIntent,
            new Error(`User not found for order. userId=${order.userId}`),
          );
          break;
        }

        try {
          const result =
            await PlaceOrderService.HandleTransitionProcessOfPlacingOrder(
              user,
              order,
              "paid",
              paymentIntent.id,
            );

          if (!result.alreadyFinalized) {
            await PlaceOrderService.handleNotificationCreation(
              "payment by card succeeded",
              order,
              user,
            );
          }
        } catch (finalizationError) {
          await refundFailedOrderFinalization(
            order,
            paymentIntent,
            finalizationError,
          );
          break;
        }

        console.log(`Order ${order._id} marked as paid`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
          console.error(
            "Missing orderId in payment_intent.payment_failed metadata",
          );
          break;
        }

        await PlaceOrderService.recordPaymentFailure(
          orderId,
          "failed",
          "failed",
          paymentIntent,
          paymentIntent.last_payment_error ||
            new Error("Stripe reported a failed payment"),
        );

        console.log(`Order ${orderId} marked as payment_failed`);
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;

        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) break;

        await PlaceOrderService.recordPaymentFailure(
          orderId,
          "cancelled",
          "cancelled",
          paymentIntent,
          new Error("Stripe payment was cancelled"),
        );

        console.log(`Order ${orderId} marked as cancelled`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Stripe webhook processing error:", err);
    return next(err);
  }
};
