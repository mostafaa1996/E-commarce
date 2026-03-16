require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");

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
        console.log(paymentIntent.id);
        console.log(paymentIntent.metadata);
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
          console.error("Missing orderId in payment_intent.succeeded metadata");
          break;
        }

        const order = await Order.findById(orderId);
        if (!order) {
          console.error(
            `Order not found for succeeded payment. orderId=${orderId}`,
          );
          break;
        }

        if (order.status === "paid" || order.status === "orderPlaced") {
          break;
        }

        order.paymentIntentId = paymentIntent.id;
        order.status = "paid";
        order.paymentStatus = "succeeded";
        order.paidAt = new Date();
        order.updatedAt = new Date();

        await order.save();

        const user = await User.findById(order.userId);
        if (!user) {
          console.error(`User not found for order. userId=${order.userId}`);
          break;
        }

        const cartId = user.cart;
        if (!cartId) {
          console.error(`Cart not found for user. userId=${order.userId}`);
          break;
        }

        await Cart.findByIdAndDelete(cartId);

        user.cart = null;
        await user.save();

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

        const order = await Order.findById(orderId);
        if (!order) {
          console.error(
            `Order not found for failed payment. orderId=${orderId}`,
          );
          break;
        }

        order.paymentIntentId = paymentIntent.id;
        order.status = "payment_failed";
        order.paymentStatus = "failed";
        order.updatedAt = new Date();

        const lastError = paymentIntent.last_payment_error;
        if (lastError) {
          order.paymentFailureReason = {
            code: lastError.code || "",
            message: lastError.message || "",
            type: lastError.type || "",
          };
        }

        await order.save();

        console.log(`Order ${order._id} marked as payment_failed`);
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;

        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) break;

        const order = await Order.findById(orderId);
        if (!order) break;

        order.paymentIntentId = paymentIntent.id;
        order.status = "cancelled";
        order.paymentStatus = "cancelled";
        order.updatedAt = new Date();

        await order.save();

        console.log(`Order ${order._id} marked as cancelled`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Stripe webhook processing error:", err);
    return next(err);
  }
};
