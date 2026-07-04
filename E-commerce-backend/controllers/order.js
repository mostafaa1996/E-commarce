const mongoose = require("mongoose");
const PlaceOrderService = require("../services/PlaceOrderService");
const checkoutService = require("../services/checkoutService");
exports.createOrder = async (req, res, next) => {
  try {
    // console.log(req.body);
    const user = req.user;
    const userId = user._id;
    // ***************** populate the order details from the request body *****************
    const Notes = req.body?.orderNotes || "";
    const paymentMethod = req.body?.paymentType || "";
    const selectedCardId = req.body?.selectedCard || "";
    if (paymentMethod !== "cod" && paymentMethod !== "card") {
      return res.status(400).json({
        message:
          "Invalid payment method.Payment method must be 'cod' or 'card' so we need you to provide a valid payment method",
        nextAction: "payment_Invalid",
        header: "payment Invalid",
        IconName: "triangleAlert",
      });
    }
    if (paymentMethod === "card" && !selectedCardId) {
      return res.status(400).json({
        message:
          "A payment card is required. Please provide a valid payment card",
        nextAction: "payment_Invalid",
        header: "payment Invalid",
        IconName: "triangleAlert",
      });
    }
    /** Find the shipping details */
    const reqAddress = await PlaceOrderService.handleAddressPreparation(userId);
    if (reqAddress === "No default address found")
      return res.status(422).json({
        message:
          "Can`t determine which address to use. Please add a default address",
        nextAction: "Missing_Default_address",
        header: "Missing Default address",
        IconName: "userX",
      });
    if (Array.isArray(reqAddress) && reqAddress.length === 0)
      return res.status(422).json({
        message: "Shipping address not found",
        nextAction: "Address_missing",
        header: "Address Required",
        IconName: "userX",
      });
    if (reqAddress === null) {
      return res.status(422).json({
        message: "Shipping address is not found for this user",
        nextAction: "Address_missing",
        header: "Address Required",
        IconName: "userX",
      });
    }
    //sanitize the shipping details
    const shippingAddress = {
      firstName: reqAddress.name?.split(" ")[0] || "",
      lastName: reqAddress.name?.split(" ")[1] || "",
      label: reqAddress.label || "Home",
      country: reqAddress.country || "",
      city: reqAddress.city || "",
      state: reqAddress.state || "",
      postalCode: reqAddress.zipCode || "",
      street: reqAddress.street || "",
      phone: reqAddress.phone || "",
      email: reqAddress.email || "",
      Apartment: reqAddress.street?.split(",").slice(1).join(",") || "",
    };

    /** get the cart and the cartItems */
    const CartResult = await PlaceOrderService.getCartAndCartItems(userId);
    if (CartResult === "No cart found") {
      return res.status(404).json({
        message: "Cart not found.something went wrong, Please try again",
        nextAction: "Error",
        header: "Cart not found",
        IconName: "cart",
      });
    }
    if (CartResult === "cart is empty") {
      return res.status(409).json({
        message:
          "Cart is empty and cannot be ordered. Please add items to the cart",
        nextAction: "Cart_empty",
        header: "Cart is empty",
        IconName: "cart",
      });
    }
    const { orderItems, cart } = CartResult;

    const cartItemValidation =
      await PlaceOrderService.validateCartItemsForOrder(cart);
    if (!cartItemValidation.valid) {
      const messages = {
        PRODUCT_NOT_FOUND: "A product or variant in the cart no longer exists",
        PRODUCT_UNAVAILABLE: "A product or variant in the cart is unavailable",
        INSUFFICIENT_STOCK: `Only ${cartItemValidation.availableStock} items are available`,
        PRICE_CHANGED: "A product price changed. Review the updated cart total",
      };

      return res.status(409).json({
        message:
          messages[cartItemValidation.reason] ||
          "The cart must be reviewed before ordering",
        nextAction: "Error",
        reason: cartItemValidation.reason,
        header: "Cart Invalid",
        IconName: "cart",
      });
    }

    const couponValidation = await PlaceOrderService.validateAppliedCoupon(
      cart,
      user,
    );
    if (!couponValidation.valid) {
      return res.status(409).json({
        message: "The applied coupon is no longer available or invalid",
        nextAction: "Error",
        reason: "Coupon_invalid",
        header: "Coupon Invalid",
        IconName: "cart",
      });
    }

    // ***************** calculate the shipping cost *****************
    let shippingCost =
      await PlaceOrderService.calculateShippingCost(reqAddress);
    if (shippingCost === "Shipping location not supported") {
      return res.status(422).json({
        message: `Shipping location is out of service area. Please select another location within these locations: ${
          await PlaceOrderService.getShippingLocations() || ""
        }`,
        nextAction: "Shipping_location_not_supported",
        header: "Shipping location not supported",
        IconName: "userX",
      });
    }
    if (couponValidation.coupon?.discountType === "FREE_SHIPPING") {
      shippingCost = 0;
    }
    const total = await checkoutService.updateFinalTotalPrice(
      shippingCost,
      cart,
    );

    // ***************** create the order *****************
    const order = await PlaceOrderService.handleCreationOrder(
      orderItems,
      Notes,
      shippingAddress,
      paymentMethod,
      shippingCost,
      cart,
      selectedCardId,
      userId,
      total,
    );
    if (!order)
      return res
        .status(500)
        .json({ message: "Order not created", nextAction: "Error" });

    // ***************** Carry out the payment cash on delivery *****************
    if (paymentMethod === "cod") {
      await PlaceOrderService.HandleTransitionProcessOfPlacingOrder(
        user,
        order,
        "not_required",
      );
      try {
        await PlaceOrderService.handleNotificationCreation("cod", order, user);
      } catch (error) {
        console.error("Notification failed:", error);
      }
      return res.status(201).json({
        orderId: order._id,
        orderNumber: order.orderNumber,
        nextAction: "orderPlaced",
        message: "Order created and placed successfully",
        header: "Order created",
        IconName: "packageCheck",
      });
    }
    // ***************** Carry out the payment card *****************
    if (paymentMethod === "card") {
      let paymentIntent = null;
      try {
        paymentIntent = await PlaceOrderService.makePaymentIntentionInStripe(
          order,
          userId,
          selectedCardId,
        );
      } catch (err) {
        await PlaceOrderService.handleNotificationCreation(
          "PaymentIntentionFailed",
          order,
          user,
        );
        await PlaceOrderService.recordPaymentFailure(
          order._id,
          "failed",
          "failed",
          null,
          err,
        );
        return res.status(500).json({
          orderId: order._id,
          orderNumber: order.orderNumber,
          message: "Failed to create payment intent",
          nextAction: "failed",
          header: "Payment failed",
          IconName: "circleX",
        });
      }

      try {
        await PlaceOrderService.savePaymentIntentIdForUser(
          order,
          paymentIntent,
        );
      } catch (err) {
        const paymentIntentWasCancelled = err.paymentIntentCancelled === true;
        await PlaceOrderService.recordPaymentFailure(
          order._id,
          paymentIntentWasCancelled ? "cancelled" : "failed",
          paymentIntentWasCancelled ? "cancelled" : "pending",
          paymentIntent,
          err,
        );
        return res.status(500).json({
          orderId: order._id,
          orderNumber: order.orderNumber,
          message: paymentIntentWasCancelled
            ? "Failed to update order. Payment was cancelled."
            : "Failed to update order or cancel the pending payment.",
          nextAction: "Error",
          header: "Payment cancelled",
          IconName: "ban",
        });
      }

      let confirmedPaymentIntent;
      try {
        confirmedPaymentIntent = await PlaceOrderService.confirmedPaymentIntent(
          paymentIntent,
          selectedCardId,
          order,
        );
      } catch (err) {
        await PlaceOrderService.recordPaymentFailure(
          order._id,
          "failed",
          "failed",
          err.payment_intent || paymentIntent,
          err,
        );
        await PlaceOrderService.handleNotificationCreation(
          "PaymentIntentionFailed",
          order,
          user,
        );
        return res.status(402).json({
          orderId: order._id,
          orderNumber: order.orderNumber,
          message: err.message || "Payment confirmation failed",
          nextAction: "failed",
          header: "Payment failed",
          IconName: "circleX",
        });
      }

      if (confirmedPaymentIntent.status === "requires_action") {
        await PlaceOrderService.updateOrderStatus(
          order._id,
          "pending",
          "pending",
        );
        return res.status(201).json({
          clientSecret: paymentIntent.client_secret,
          orderId: order._id,
          orderNumber: order.orderNumber,
          nextAction: confirmedPaymentIntent.status,
          message: "Authentication required for payment",
          header: "Authentication required",
          IconName: "loader",
        });
      }
      if (confirmedPaymentIntent.status === "succeeded") {
        return res.status(202).json({
          orderId: order._id,
          orderNumber: order.orderNumber,
          nextAction: "paid",
          message: "Payment succeeded and the order is being finalized",
          header: "Payment succeeded",
          IconName: "badgeCheck",
        });
      }
      if (confirmedPaymentIntent.status === "processing") {
        await PlaceOrderService.updateOrderStatus(
          order._id,
          "pending",
          "pending",
        );
        return res.status(202).json({
          orderId: order._id,
          orderNumber: order.orderNumber,
          nextAction: "pending_payment",
          message: "Payment is still processing",
          header: "Payment processing",
          IconName: "loader",
        });
      }

      const wasCancelled = confirmedPaymentIntent.status === "canceled";
      await PlaceOrderService.recordPaymentFailure(
        order._id,
        wasCancelled ? "cancelled" : "failed",
        wasCancelled ? "cancelled" : "failed",
        confirmedPaymentIntent,
        new Error(
          `Unexpected payment status: ${confirmedPaymentIntent.status}`,
        ),
      );

      return res.status(402).json({
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
        orderNumber: order.orderNumber,
        nextAction: "cancelled",
        message: "Payment cancelled, please try again",
        header: "Payment Cancelled",
        IconName: "ban",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
