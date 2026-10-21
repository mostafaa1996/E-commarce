require("dotenv").config();
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const VAT_shipping = require("../models/VAT");
const Order = require("../models/Order");
const User = require("../models/User");
const { Coupon } = require("../models/Coupons");
const { createNotifications } = require("./createNotifications");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const getOrCreateCustomer = require("../services/StripeCustomer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { formatOrderId } = require("../services/formatOrderNumber");
const BuyNowCart = require("../models/BuyNowCart");
async function handleAddressPreparation(userId) {
  const addresses = await Address.find({ user: userId });
  if (Array.isArray(addresses) && addresses.length === 0) return [];
  let reqAddress = null;
  if (addresses && Array.isArray(addresses) && addresses.length > 0) {
    reqAddress = addresses.find((address) => address.isDefault === true);
    if (!reqAddress) {
      return "No default address found";
    }
    return reqAddress;
  }
  return null;
}

async function getCartAndCartItems(userId, cartId) {
  if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
    return "Invalid cart id";
  }

  let cart = null;
  cart = await BuyNowCart.findOne({ _id: cartId, userId, cartType: "BUY_NOW" });
  if (!cart) {
    cart = await Cart.findOne({ _id: cartId, userId, cartType: "CART" });
  }
  if (!cart) {
    return "No cart found";
  }
  if (!cart.products.length) {
    return "cart is empty";
  }
  const orderItems = cart.products.map((product) => ({
    quantity: product.quantity,
    subtotal: product.subtotal,
    price: product.price,
    product: product.productId,
    variant: product.variantId,
  }));
  return { orderItems, cart };
}

async function validateCartItemsForOrder(cart) {
  const products = await Product.find({
    _id: { $in: cart.products.map((item) => item.productId) },
  })
    .select("_id isActive variants")
    .lean();

  let priceChanged = false;

  for (const item of cart.products) {
    const product = products.find(
      (candidate) => String(candidate._id) === String(item.productId),
    );
    const variant = product?.variants.find(
      (candidate) => String(candidate._id) === String(item.variantId),
    );

    if (!product || !variant) {
      return { valid: false, reason: "PRODUCT_NOT_FOUND" };
    }
    if (
      !product.isActive ||
      !variant.isActive ||
      variant.availabilityStatus === "OUT_OF_STOCK"
    ) {
      return { valid: false, reason: "PRODUCT_UNAVAILABLE" };
    }
    if (variant.stock < item.quantity) {
      return {
        valid: false,
        reason: "INSUFFICIENT_STOCK",
        availableStock: variant.stock,
      };
    }

    if (Number(item.price) !== Number(variant.price)) {
      item.price = variant.price;
      item.subtotal = variant.price * item.quantity;
      priceChanged = true;
    }
  }

  if (priceChanged) {
    cart.itemsPrice = cart.products.reduce(
      (total, item) => total + item.subtotal,
      0,
    );
    cart.totalItems = cart.products.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    if (cart.promo?.discountType === "PERCENTAGE") {
      cart.promo.discountInMoney =
        cart.itemsPrice * (cart.promo.discountValue / 100);
    } else if (cart.promo?.discountType === "FIXED") {
      cart.promo.discountInMoney = Math.min(
        cart.promo.discountValue,
        cart.itemsPrice,
      );
    }

    const taxConfig = await VAT_shipping.findOne({}).select("vat").lean();
    const vatRate = Number(taxConfig?.vat) || 0;
    const shippingCost =
      cart.promo?.discountType === "FREE_SHIPPING"
        ? 0
        : Number(cart.shippingCost) || 0;
    cart.TAX = cart.itemsPrice * vatRate;
    cart.totalPrice =
      Math.max(cart.itemsPrice - (cart.promo?.discountInMoney || 0), 0) +
      cart.TAX +
      shippingCost;
    cart.updatedAt = new Date();
    await cart.save();
    return { valid: false, reason: "PRICE_CHANGED" };
  }

  return { valid: true };
}

async function handleCreationOrder(
  orderItems,
  Notes,
  shippingAddress,
  paymentMethod,
  shippingCost,
  cart,
  selectedCardId,
  userId,
  total,
) {
  const order = await Order.create({
    orderItems: orderItems || [],
    Notes,
    shippingAddress,
    paymentMethod,
    status: "pending",
    paymentStatus: paymentMethod === "cod" ? "not_required" : "pending",
    itemsPrice: cart.itemsPrice || 0,
    shippingPrice: shippingCost || 0,
    taxPrice: cart.TAX || 0,
    totalPrice: total || 0,
    totalItems: cart.totalItems || 0,
    selectedCardId,
    cartId: cart._id,
    cartUpdatedAt: cart.updatedAt || null,
    promo: {
      code: cart.promo?.code || null,
      discountType: cart.promo?.discountType || null,
      discountValue: cart.promo?.discountValue || 0,
      discountInMoney: cart.promo?.discountInMoney || 0,
    },
    userId,
    orderNumber: "order",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  if (!order) return null;
  order.orderNumber = formatOrderId(order);
  const updatedOrder = await order.save();
  return updatedOrder;
}

async function handleNotificationCreation(info, order, user) {
  if (info === "cod") {
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
  } else if (info === "PaymentIntentionFailed") {
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
  } else if (info === "payment by card succeeded") {
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
  }
}

async function UpdateUserAfterOrderPlacing(
  user = null,
  order = null,
  session = null,
) {
  if (!user || !order || !session) return null;

  const update = {
    $inc: {
      totalOrders: 1,
      totalSpent: order.totalPrice,
    },
    $addToSet: {
      orders: order._id,
    },
    $set: {},
  };

  const options = { new: true };
  const userFilter = {
    _id: user._id,
    orders: { $ne: order._id },
  };

  if (order.promo?.code) {
    userFilter.coupons = {
      $elemMatch: {
        code: order.promo.code,
        status: { $nin: ["USED", "EXPIRED"] },
      },
    };
    update.$set["coupons.$[coupon].status"] = "USED";
    update.$set["coupons.$[coupon].usedAt"] = new Date();

    options.arrayFilters = [
      {
        "coupon.code": order.promo.code,
      },
    ];
  }

  if (Object.keys(update.$set).length === 0) {
    delete update.$set;
  }

  const updatedUser = await User.findOneAndUpdate(userFilter, update, {
    ...options,
    session,
  });

  return updatedUser;
}

async function UpdateCouponAfterOrderPlacing(order = null, session = null) {
  if (!order || !session) return null;
  if (order.promo?.code) {
    const now = new Date();
    const updatedCoupon = await Coupon.findOneAndUpdate(
      {
        code: order.promo.code,
        status: "ACTIVE",
        startDate: { $lte: now },
        expireDate: { $gt: now },
        $or: [
          { usageLimit: 0 },
          { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
        ],
      },
      { $inc: { usageCount: 1 } },
      { new: true, session },
    );

    if (!updatedCoupon) {
      throw new Error("Coupon is no longer available");
    }
  }
}

async function UpdateCartAfterOrderPlacing(order, userId, session = null) {
  if (!order?.cartId || !userId || !session) return;
  await BuyNowCart.findOneAndDelete({ _id: order.cartId , userId }, { session });
  const deletedCart = await Cart.findOneAndDelete({ _id: order.cartId , userId }, { session });
  if(deletedCart) {
    await User.findOneAndUpdate(
      { _id: userId },
      {$set: { cart: null }},
      { session },
    );    
  }
}

async function UpdateProductAfterOrderPlacing(orderItems = [], session = null) {
  if (orderItems.length > 0) {
    const now = new Date();
    const PurchasedProducts = await Product.find({
      _id: { $in: orderItems.map((item) => item.product) },
    })
      .select("variants inventory soldCount updatedAt")
      .session(session)
      .lean();
    const statusUpdates = [];
    for (const item of orderItems) {
      const product = PurchasedProducts.find(
        (p) => String(p._id) === String(item.product),
      );
      const selectedVariant = product?.variants.find(
        (variant) => String(variant._id) === String(item.variant),
      );
      if (selectedVariant) {
        const remainingStock = selectedVariant.stock - item.quantity;
        let availabilityStatus = "IN_STOCK";
        if (remainingStock <= 0) {
          availabilityStatus = "OUT_OF_STOCK";
        } else if (remainingStock <= selectedVariant.criticalStockThreshold) {
          availabilityStatus = "CRITICAL_STOCK";
        } else if (remainingStock <= selectedVariant.lowStockThreshold) {
          availabilityStatus = "LOW_STOCK";
        }

        statusUpdates.push({
          updateOne: {
            filter: {
              _id: item.product,
              variants: {
                $elemMatch: {
                  _id: item.variant,
                  stock: { $gte: item.quantity },
                },
              },
            },
            update: {
              $inc: {
                "variants.$.stock": -item.quantity,
                "variants.$.soldCount": item.quantity,
                "inventory.totalStock": -item.quantity,
                soldCount: item.quantity,
              },
              $set: {
                "variants.$.availabilityStatus": availabilityStatus,
                "variants.$.updatedAt": now,
                updatedAt: now,
              },
            },
          },
        });
      }
    }

    if (statusUpdates.length !== orderItems.length) {
      throw new Error("One or more products or variants were not found");
    }

    const result = await Product.bulkWrite(statusUpdates, {
      ordered: true,
      session,
    });

    if (result.matchedCount !== statusUpdates.length) {
      throw new Error("Insufficient stock");
    }
  }
}

async function updateOrderStatus(
  orderId,
  status,
  paymentStatus = null,
  session = null,
  extraFields = {},
) {
  const updates = {
    status,
    ...extraFields,
  };

  if (paymentStatus !== null) {
    updates.paymentStatus = paymentStatus;
  }

  return Order.findOneAndUpdate(
    { _id: orderId },
    { $set: updates },
    { new: true, session },
  );
}

async function calculateShippingCost(address) {
  const vatConfig = await VAT_shipping.findOne({}).select("delivery").lean();
  const normalizedDelivery = (vatConfig?.delivery || []).map((delivery) => ({
    ...delivery,
    place: String(delivery.place || "")
      .trim()
      .toLowerCase(),
  }));

  const locationParts = [address?.city, address?.state, address?.country]
    .filter(Boolean)
    .map((part) => String(part).trim().toLowerCase());

  const exactShippingLocation = normalizedDelivery.find((delivery) =>
    locationParts.includes(delivery.place),
  );

  if (!exactShippingLocation) return "Shipping location not supported";

  const shippingCost = exactShippingLocation?.cost || 0;

  return shippingCost;
}

async function validateAppliedCoupon(cart, user) {
  if (!cart.promo?.code) {
    return { valid: true, coupon: null };
  }

  const now = new Date();
  const coupon = await Coupon.findOne({
    code: cart.promo.code,
    status: "ACTIVE",
    startDate: { $lte: now },
    expireDate: { $gt: now },
    $or: [
      { usageLimit: 0 },
      { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
    ],
  });

  if (!coupon) {
    return { valid: false, coupon: null };
  }

  const requiredValue = Number(coupon.eligibilityValue || 0);
  const ordersCount = Number(user?.totalOrders || user?.orders?.length || 0);
  const totalSpent = Number(user?.totalSpent || 0);
  const userCoupon = user?.coupons?.find(
    (item) => String(item.couponId) === String(coupon._id),
  );
  if (!userCoupon || ["USED", "EXPIRED"].includes(userCoupon.status)) {
    return { valid: false, coupon };
  }
  let isEligible = false;

  if (coupon.eligibilityType === "MIN_ORDER_VALUE") {
    isEligible = cart.itemsPrice >= requiredValue;
  } else if (coupon.eligibilityType === "MIN_ORDERS_COUNT") {
    isEligible = ordersCount >= requiredValue;
  } else if (coupon.eligibilityType === "MIN_TOTAL_SPENT") {
    isEligible = totalSpent >= requiredValue;
  } else if (coupon.eligibilityType === "FIRST_ORDER") {
    isEligible = ordersCount === 0;
  } else if (coupon.eligibilityType === "SPECIFIC_USERS") {
    isEligible = userCoupon.status === "ASSIGNED";
  }

  if (!isEligible) {
    return { valid: false, coupon };
  }

  cart.promo.discountType = coupon.discountType;
  cart.promo.discountValue = coupon.discountValue;

  if (coupon.discountType === "PERCENTAGE") {
    cart.promo.discountInMoney = cart.itemsPrice * (coupon.discountValue / 100);
  } else if (coupon.discountType === "FIXED") {
    cart.promo.discountInMoney = Math.min(
      coupon.discountValue,
      cart.itemsPrice,
    );
  } else {
    cart.promo.discountInMoney = 0;
  }

  return { valid: true, coupon };
}

async function makePaymentIntentionInStripe(order, userId, selectedCardId) {
  const customerId = await getOrCreateCustomer(userId);
  console.log("Creating intent:", __filename, selectedCardId);
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: Math.round(order.totalPrice * 100),
      currency: "usd",
      customer: customerId,
      payment_method: selectedCardId,
      payment_method_types: ["card"],
      metadata: {
        orderId: String(order._id),
        userId: String(userId),
      },
    },
    {
      idempotencyKey: `order-payment-${order._id}`,
    },
  );
  console.log(
    "Created intent:",
    paymentIntent.id,
    paymentIntent.payment_method,
    paymentIntent.payment_method_types,
  );

  return paymentIntent;
}

async function savePaymentIntentIdForUser(order, paymentIntent) {
  try {
    order.paymentIntentId = paymentIntent.id;
    await order.save();
    return order;
  } catch (err) {
    try {
      await stripe.paymentIntents.cancel(paymentIntent.id);
      err.paymentIntentCancelled = true;
    } catch (cancelError) {
      err.cancelError = cancelError;
    }
    throw err;
  }
}

async function confirmedPaymentIntent(paymentIntent, selectedCardId, order) {
  const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
    paymentIntent.id,
    {
      payment_method: selectedCardId,
      return_url: `${process.env.CLIENT_URL}/checkout/payment/complete/${order._id}`,
    },
  );
  return confirmedPaymentIntent;
}

async function refundPaymentIntent(paymentIntentId, orderId) {
  return stripe.refunds.create(
    {
      payment_intent: paymentIntentId,
      metadata: {
        orderId: String(orderId),
        reason: "order_finalization_failed",
      },
    },
    {
      idempotencyKey: `order-finalization-refund-${orderId}`,
    },
  );
}

async function recordPaymentFailure(
  orderId,
  status,
  paymentStatus,
  paymentIntent,
  error,
) {
  const failureReason = {
    code:
      error?.code ||
      paymentIntent?.last_payment_error?.code ||
      "PAYMENT_PROCESSING_FAILED",
    message:
      error?.message ||
      paymentIntent?.last_payment_error?.message ||
      "Payment processing failed",
    type:
      error?.type || paymentIntent?.last_payment_error?.type || "payment_error",
  };

  const updates = {
    status,
    paymentStatus,
    paymentFailureReason: failureReason,
  };

  if (paymentIntent?.id) {
    updates.paymentIntentId = paymentIntent.id;
  }

  return Order.findOneAndUpdate(
    {
      _id: orderId,
      status: { $nin: ["orderPlaced", "delivered", "shipped", "returned"] },
    },
    { $set: updates },
    { new: true },
  );
}

async function HandleTransitionProcessOfPlacingOrder(
  user,
  order,
  paymentStatus,
  paymentIntentId = null,
) {
  const session = await mongoose.startSession();
  let alreadyFinalized = false;

  try {
    await session.withTransaction(async () => {
      const claimUpdates = {
        status: "processing",
      };
      if (paymentIntentId) {
        claimUpdates.paymentIntentId = paymentIntentId;
      }

      const claimedOrder = await Order.findOneAndUpdate(
        {
          _id: order._id,
          status: "pending",
        },
        {
          $set: claimUpdates,
        },
        {
          new: true,
          session,
        },
      );

      if (!claimedOrder) {
        const currentOrder = await Order.findById(order._id).session(session);

        if (currentOrder?.status === "orderPlaced") {
          alreadyFinalized = true;
          return;
        }

        throw new Error("Order cannot be finalized from its current state");
      }

      const updatedUser = await UpdateUserAfterOrderPlacing(
        user,
        claimedOrder,
        session,
      );
      if (!updatedUser) {
        throw new Error("User order totals were not updated");
      }

      await UpdateCouponAfterOrderPlacing(claimedOrder, session);
      await UpdateCartAfterOrderPlacing(claimedOrder, user._id, session);
      await UpdateProductAfterOrderPlacing(claimedOrder.orderItems, session);

      await updateOrderStatus(
        claimedOrder._id,
        "orderPlaced",
        paymentStatus,
        session,
        paymentStatus === "paid" ? { paidAt: new Date() } : {},
      );
    });
  } catch (err) {
    if (paymentStatus === "not_required") {
      await updateOrderStatus(order._id, "failed", "not_required");
    }
    throw err;
  } finally {
    await session.endSession();
  }

  return { alreadyFinalized };
}

async function getShippingLocations() {
  const vatConfig = await VAT_shipping.findOne({}).select("delivery").lean();
  const normalizedDelivery = (vatConfig?.delivery || []).map((delivery) => ({
    ...delivery,
    place: String(delivery.place || "")
      .trim()
      .toLowerCase(),
  }));
  return normalizedDelivery.map((delivery) => delivery.place)?.join(",");
}

module.exports = {
  handleAddressPreparation,
  getCartAndCartItems,
  validateCartItemsForOrder,
  calculateShippingCost,
  validateAppliedCoupon,
  handleCreationOrder,
  handleNotificationCreation,
  UpdateUserAfterOrderPlacing,
  UpdateCouponAfterOrderPlacing,
  UpdateProductAfterOrderPlacing,
  UpdateCartAfterOrderPlacing,
  updateOrderStatus,
  makePaymentIntentionInStripe,
  savePaymentIntentIdForUser,
  confirmedPaymentIntent,
  refundPaymentIntent,
  recordPaymentFailure,
  HandleTransitionProcessOfPlacingOrder,
  getShippingLocations,
};
