require("dotenv").config();
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const getOrCreateCustomer = require("../utils/StripeCustomer");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const { formatOrderId } = require("../utils/formatOrderNumber");
const { createNotifications } = require("../utils/createNotifications");
const { link } = require("../routes/shop");
exports.createOrder = async (req, res, next) => {
  try {
    // console.log(req.body);
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not found", nextAction: "Error" });
    // ***************** populate the order details from the request body *****************
    const Notes = req.body.orderNotes || "";
    const paymentMethod = req.body.paymentType || "";
    if (paymentMethod !== "cod" && paymentMethod !== "card") {
      return res.status(401).json({
        message: "Invalid payment method",
        nextAction: "payment_Invalid",
      });
    }
    /** Find the shipping details */
    const addresses = await Address.find({ user: userId });
    let reqAddress = null;
    if (addresses && addresses.length > 0) {
      reqAddress = addresses.find((address) => address.isDefault === true);
      if (reqAddress === undefined) reqAddress = addresses[0];
    }
    if (!reqAddress)
      return res.status(401).json({
        message: "Shipping address not found",
        nextAction: "Address_missing",
      });
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
      Apartment: reqAddress.street?.split(",").slice(2).join(",") || "",
    };

    /** get the cart */
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(401)
        .json({ message: "Cart not found", nextAction: "Error" });
    }
    if (!cart.products.length) {
      return res.status(401).json({
        message: "Cart is empty",
        nextAction: "Cart_empty",
      });
    }
    const orderItems = cart.products.map((product) => ({
      quantity: product.quantity,
      subtotal: product.subtotal,
      price: product.price,
      product: product.productId,
      variant: product.variantId,
    }));

    const selectedCardId = req.body.selectedCard || "";
    // ***************** create the order *****************
    const order = await Order.create({
      orderItems: orderItems || [],
      Notes,
      shippingAddress,
      paymentMethod,
      status: paymentMethod === "cod" ? "orderPlaced" : "pending",
      paymentStatus: paymentMethod === "cod" ? "not_required" : "pending",
      itemsPrice: cart.itemsPrice || 0,
      shippingPrice: cart.shippingCost || 0,
      taxPrice: cart.TAX || 0,
      totalPrice: cart.totalPrice || 0,
      totalItems: cart.totalItems || 0,
      selectedCardId,
      userId,
      orderNumber: "order",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!order)
      return res
        .status(500)
        .json({ message: "Order not created", nextAction: "Error" });

    order.orderNumber = formatOrderId(order);
    const updatedOrder = await order.save();
    if (!updatedOrder)
      return res.status(500).json({
        message: "Failed to update order with order number",
        nextAction: "Error",
      });

    user.orders.push(order._id);
    const updatedUser = await user.save();
    if (!updatedUser)
      return res.status(500).json({
        message: "Failed to update user with order",
        nextAction: "Error",
      });

    if (paymentMethod === "cod") {
      try {
        await createNotifications({
          type: "NEW_ORDER",
          title: "New Order",
          message: `A new order ${order.orderNumber} has been placed from ${user.name} and payment method is cash on delivery - ${order.totalPrice}`,
          priority: "NORMAL",
          isRead: false,
          entityType: "ORDER",
          entityId: order._id,
          link: `/profile/admin/orders/${order._id}`,
        });
      } catch (err) {
        console.log(err);
      }
      user.totalOrders += 1;
      user.totalSpent += order.totalPrice;
      user.cart = null;
      await user.save();
      await Cart.findOneAndDelete({ userId });
      if (orderItems.length > 0) {
        const now = new Date();
        await Product.bulkWrite(
          orderItems.map((item) => ({
            updateOne: {
              filter: { _id: item.product, "variants._id": item.variant },
              update: {
                $inc: {
                  "variants.$.stock": -item.quantity,
                  "inventory.totalStock": -item.quantity,
                  soldCount: item.quantity,
                },
                $set: {
                  "variants.$.updatedAt": now,
                  updatedAt: now,
                },
              },
            },
          })),
        );
      }

      return res.status(201).json({
        orderId: order._id,
        orderNumber: order.orderNumber,
        nextAction: "orderPlaced",
        message: "Order created and placed successfully",
      });
    }
    if (paymentMethod === "card") {
      const customerId = await getOrCreateCustomer(userId);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100),
        currency: "usd",
        customer: customerId,
        metadata: {
          orderId: String(order._id),
          userId: String(userId),
        },
      });

      if (!paymentIntent) {
        try {
          await createNotifications({
            type: "PAYMENT_FAILED",
            title: "New Order with payment failed",
            message: `A new order has been placed and payment failed by card payment method - ${order.totalPrice}`,
            priority: "URGENT",
            isRead: false,
            entityType: "ORDER",
            entityId: order._id,
            link: `/profile/admin/orders/${order._id}`,
          });
        } catch (err) {
          console.log(err);
        }
        order.status = "failed";
        order.paymentStatus = "failed";
        await order.save();
        return res.status(500).json({
          orderId: order._id,
          orderNumber: order.orderNumber,
          message: "Failed to create payment intent",
          nextAction: "failed",
        });
      }

      try {
        order.paymentIntentId = paymentIntent.id;
        await order.save();
      } catch (err) {
        await stripe.paymentIntents.cancel(paymentIntent.id);

        return res.status(500).json({
          orderId: order._id,
          orderNumber: order.orderNumber,
          message: "Failed to update order. Payment was cancelled.",
          nextAction: "Error",
        });
      }

      const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {
          payment_method: selectedCardId,
          return_url: `${process.env.CLIENT_URL}/payment/complete/${order._id}`,
        },
      );

      if (confirmedPaymentIntent.status === "requires_action") {
        order.status = "pending";
        order.paymentStatus = "pending";
        await order.save();
        return res.status(201).json({
          clientSecret: paymentIntent.client_secret,
          orderId: order._id,
          orderNumber: order.orderNumber,
          nextAction: paymentIntent.status,
          message: "Authentication required for payment",
        });
      }
      if (confirmedPaymentIntent.status === "succeeded") {
        try {
          await createNotifications({
            type: "NEW_ORDER",
            title: "New Order with payment succeeded",
            message: `A new order ${order.orderNumber} has been placed from ${user.name} and payment succeeded by card payment method - ${order.totalPrice}`,
            priority: "NORMAL",
            isRead: false,
            entityType: "ORDER",
            entityId: order._id,
            link: `/profile/admin/orders/${order._id}`,
          });
        } catch (err) {
          console.log(err);
        }
        user.totalOrders += 1;
        user.totalSpent += order.totalPrice;
        user.cart = null;
        await user.save();
        await Cart.findOneAndDelete({ userId });
        order.status = "orderPlaced";
        order.paymentStatus = "paid";
        await order.save();
        if (orderItems.length > 0) {
          const now = new Date();
          await Product.bulkWrite(
            orderItems.map((item) => ({
              updateOne: {
                filter: { _id: item.product, "variants._id": item.variant },
                update: {
                  $inc: {
                    "variants.$.stock": -item.quantity,
                    "inventory.totalStock": -item.quantity,
                    soldCount: item.quantity,
                  },
                  $set: {
                    "variants.$.updatedAt": now,
                    updatedAt: now,
                  },
                },
              },
            })),
          );
        }
        return res.status(201).json({
          orderId: order._id,
          orderNumber: order.orderNumber,
          nextAction: "paid",
          message: "Payment succeeded",
        });
      }
      if (confirmedPaymentIntent.status === "requires_payment_method") {
        return res.status(201).json({
          clientSecret: paymentIntent.client_secret,
          orderId: order._id,
          orderNumber: order.orderNumber,
          nextAction: "cancelled",
          message: "Payment cancelled, please try again",
        });
      }
      res.status(500).json({
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
        orderNumber: order.orderNumber,
        nextAction: "cancelled",
        message: "Payment cancelled, please try again",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
