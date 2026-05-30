require("dotenv").config();
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const VAT_shipping = require("../models/VAT");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const getOrCreateCustomer = require("../utils/StripeCustomer");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
exports.createOrder = async (req, res, next) => {
  try {
    // console.log(req.body);
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not found", nextAction: "Error" });
    // ***************** populate the order details from the request body *****************
    const notes = req.body.orderNotes || "";
    const paymentMethod = req.body.selectedCard ? "card" : "cod";
    /** Find the shipping details */
    const addresses = await Address.find({ user: userId });
    let reqAddress = null;
    if(addresses && addresses.length > 0){
      reqAddress = addresses.find((address) => address.isDefault === true);
      if(reqAddress === undefined) reqAddress = addresses[0];
    }
    //sanitize the shipping details
    shippingAddress = {
      firstName: reqAddress.name.split(" ")[0] || "",
      lastName: reqAddress.name.split(" ")[1] || "",
      label: reqAddress.label || "Home",
      country: reqAddress.country || "",
      city: reqAddress.city || "",
      state: reqAddress.state || "",
      postalCode: reqAddress.zipCode || "",
      street: reqAddress.street || "",
      phone: reqAddress.phone || "",
      email: reqAddress.email || "",
      Apartment: reqAddress.street.split(",").slice(2).join(",") || "",
    };
    /** end of the shipping details */
    const vatConfig = await VAT_shipping.findOne();
    if (!vatConfig) {
      return res.status(500).json({
        message: "VAT/shipping config not found",
        nextAction: "Error",
      });
    }
    /** get the cart */
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(400)
        .json({ message: "Cart not found", nextAction: "Error" });
    }

    const selectedCardId = req.body.selectedCard || "";
    // ***************** create the order *****************
    const order = await Order.create({
      orderItems : cart.products || [],
      notes,
      shippingAddress,
      paymentMethod,
      status: paymentMethod === "cod" ? "orderPlaced" : "pending_payment",
      paymentStatus: paymentMethod === "cod" ? "not_required" : "pending",
      itemsPrice : cart.itemsPrice || 0,
      shippingPrice : cart.shippingCost || 0,
      taxPrice : cart.TAX || 0,
      totalPrice : cart.totalPrice || 0,
      totalItems : cart.totalItems || 0,
      selectedCardId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!order)
      return res
        .status(400)
        .json({ message: "Order not created", nextAction: "Error" });

    user.orders.push(order._id);
    const updatedUser = await user.save();
    if (!updatedUser)
      return res.status(500).json({
        message: "Failed to update user with order",
        nextAction: "Error",
      });

    if (paymentMethod === "cod") {
      return res.status(201).json({
        orderId: order._id,
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
        payment_method: selectedCardId,
        metadata: {
          orderId: String(order._id),
          userId: String(userId),
        },
        confirm: true,
        off_session: false,
        return_url: `${process.env.CLIENT_URL}/payment/complete/${order._id}`,
      });

      if (!paymentIntent)
        return res.status(500).json({
          message: "Failed to create payment intent",
          nextAction: "Error",
        });

      order.paymentIntentId = paymentIntent.id;
      const updatedOrder = await order.save();
      if (!updatedOrder)
        return res.status(500).json({ message: "Failed to update order" });

      if (paymentIntent.status === "requires_action") {
        return res.status(201).json({
          clientSecret: paymentIntent.client_secret,
          orderId: order._id,
          nextAction: paymentIntent.status,
          message: "Authentication required for payment",
        });
      }
      if (paymentIntent.status === "succeeded") {
        return res.status(201).json({
          orderId: order._id,
          nextAction: "paid",
          message: "Payment succeeded",
        });
      }
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
        nextAction: "cancelled",
        message: "Payment cancelled, please try again",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
