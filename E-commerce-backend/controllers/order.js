require("dotenv").config();
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const VAT_shipping = require("../models/VAT");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const getOrCreateCustomer = require("../utils/StripeCustomer");
exports.createOrder = async (req, res, next) => {
  try {
    // console.log(req.body);
    const orderItems = [];
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not found", nextAction: "Error" });
    // ***************** populate the order details from the request body *****************
    const notes = req.body.orderNotes || "";
    const paymentMethod = req.body.selectedCard ? "card" : "cod";
    //sanitize the shipping details
    const shippingAddress = {
      firstName: req.body.shippingDetails?.firstName || "",
      lastName: req.body.shippingDetails?.lastName || "",
      companyName: req.body.shippingDetails?.companyName || "",
      country: req.body.shippingDetails?.country || "",
      city: req.body.shippingDetails?.city || "",
      state: req.body.shippingDetails?.state || "",
      postalCode: req.body.shippingDetails?.postalCode || "",
      street: req.body.shippingDetails?.street || "",
      phone: req.body.shippingDetails?.phone || "",
      email: req.body.shippingDetails?.email || "",
      Apartment: req.body.shippingDetails?.Apartment || "",
    };

    const vatConfig = await VAT_shipping.findOne();
    if (!vatConfig) {
      return res.status(500).json({
        message: "VAT/shipping config not found",
        nextAction: "Error",
      });
    }

    //sanitize the order items
    const cartItems = req.body.cart?.map((item) => ({
      product: item.productId,
      quantity: Number(item.quantity) || 0,
    }));

    if (!cartItems?.length) {
      return res
        .status(400)
        .json({ message: "Cart is empty", nextAction: "Error" });
    }
    for (let item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
          nextAction: "Error",
        });
      const price = product.price;
      const subtotal = price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price,
        subtotal,
      });
    }
    const itemsPrice = orderItems.reduce((a, item) => a + item.subtotal, 0);
    const totalItems = orderItems.reduce((a, item) => a + item.quantity, 0);
    const shippingPrice = vatConfig.shipping * itemsPrice;
    const taxPrice = vatConfig.VAT * itemsPrice;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    const selectedCardId = req.body.selectedCard || "";
    // ***************** create the order *****************
    const order = await Order.create({
      orderItems,
      notes,
      shippingAddress,
      paymentMethod,
      status: paymentMethod === "cod" ? "orderPlaced" : "pending_payment",
      paymentStatus: paymentMethod === "cod" ? "not_required" : "pending",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      totalItems,
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
        amount: Math.round(totalPrice * 100),
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
