const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const VAT_shipping = require("../models/VAT");
const Address = require("../models/Address");
const { Coupon } = require("../models/Coupons");

function getCouponDiscountLabel(coupon) {
  if (coupon.discountType === "PERCENTAGE") {
    return `${coupon.discountValue}% off`;
  }

  if (coupon.discountType === "FIXED") {
    return `${coupon.discountValue} ${coupon.currency || "USD"} off`;
  }

  return "free shipping";
}

function getCouponBenefitScore(coupon, cartTotal) {
  if (coupon.discountType === "PERCENTAGE") {
    return (cartTotal * Number(coupon.discountValue || 0)) / 100;
  }

  if (coupon.discountType === "FIXED") {
    return Number(coupon.discountValue || 0);
  }

  return Math.max(cartTotal * 0.1, 1);
}

function getCouponProgress(coupon, customerStats) {
  const requiredValue = Number(coupon.eligibilityValue || 0);

  if (coupon.eligibilityType === "MIN_ORDER_VALUE") {
    return {
      current: customerStats.cartTotal,
      required: requiredValue,
      missing: Math.max(requiredValue - customerStats.cartTotal, 0),
      unit: coupon.currency || "USD",
    };
  }

  if (coupon.eligibilityType === "MIN_ORDERS_COUNT") {
    return {
      current: customerStats.ordersCount,
      required: requiredValue,
      missing: Math.max(requiredValue - customerStats.ordersCount, 0),
      unit: "orders",
    };
  }

  if (coupon.eligibilityType === "MIN_TOTAL_SPENT") {
    return {
      current: customerStats.totalSpent,
      required: requiredValue,
      missing: Math.max(requiredValue - customerStats.totalSpent, 0),
      unit: coupon.currency || "USD",
    };
  }

  return {
    current: 0,
    required: 0,
    missing: Number.MAX_SAFE_INTEGER,
    unit: "",
  };
}

function formatCoupon(coupon) {
  return {
    _id: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    eligibilityType: coupon.eligibilityType,
    eligibilityValue: coupon.eligibilityValue,
    currency: coupon.currency,
    expireDate: coupon.expireDate,
  };
}

function buildCouponMessage(coupon, isEligible, progress) {
  const discountLabel = getCouponDiscountLabel(coupon);

  if (isEligible) {
    return `You are eligible for ${coupon.code}: ${discountLabel}. Apply it before checkout.`;
  }

  if (coupon.eligibilityType === "MIN_ORDER_VALUE") {
    return `Add ${progress.missing} ${progress.unit} more to unlock ${coupon.code}: ${discountLabel}.`;
  }

  if (coupon.eligibilityType === "MIN_ORDERS_COUNT") {
    return `Place ${progress.missing} more order${progress.missing === 1 ? "" : "s"} to unlock ${coupon.code}: ${discountLabel}.`;
  }

  if (coupon.eligibilityType === "MIN_TOTAL_SPENT") {
    return `Spend ${progress.missing} ${progress.unit} more over time to unlock ${coupon.code}: ${discountLabel}.`;
  }

  if (coupon.eligibilityType === "FIRST_ORDER") {
    return `Use ${coupon.code} on your first order for ${discountLabel}.`;
  }

  return `${coupon.code} gives ${discountLabel}.`;
}

async function evaluateCouponEligibility(user, cart) {
  const now = new Date();
  const cartTotal = Number(cart?.totalPrice || 0);
  const couponHistory = user.coupons || [];
  const unavailableCouponIds = new Set(
    couponHistory
      .filter((coupon) => ["APPLIED", "USED"].includes(coupon.status))
      .map((coupon) => String(coupon.couponId)),
  );
  const assignedCouponIds = new Set(
    couponHistory
      .filter((coupon) => coupon.status === "ASSIGNED")
      .map((coupon) => String(coupon.couponId)),
  );
  const activeCoupons = await Coupon.find({
    status: "ACTIVE",
    startDate: { $lte: now },
    expireDate: { $gt: now },
    $or: [{ usageLimit: 0 }, { $expr: { $lt: ["$usageCount", "$usageLimit"] } }],
  }).lean();

  if (!activeCoupons.length) {
    return {
      type: "none",
      coupon: null,
      message: "No active coupons are available right now.",
    };
  }

  const customerStats = {
    cartTotal,
    ordersCount: user.orders?.length || user.totalOrders || 0,
    totalSpent: Number(user.totalSpent || 0),
  };

  const availableCoupons = activeCoupons.filter(
    (coupon) => !unavailableCouponIds.has(String(coupon._id)),
  );
  const eligibleCoupons = availableCoupons.filter((coupon) => {
    const requiredValue = Number(coupon.eligibilityValue || 0);

    if (coupon.eligibilityType === "MIN_ORDER_VALUE") {
      return cartTotal >= requiredValue;
    }

    if (coupon.eligibilityType === "MIN_ORDERS_COUNT") {
      return customerStats.ordersCount >= requiredValue;
    }

    if (coupon.eligibilityType === "MIN_TOTAL_SPENT") {
      return customerStats.totalSpent >= requiredValue;
    }

    if (coupon.eligibilityType === "FIRST_ORDER") {
      return customerStats.ordersCount === 0;
    }

    if (coupon.eligibilityType === "SPECIFIC_USERS") {
      return assignedCouponIds.has(String(coupon._id));
    }

    return false;
  });

  if (eligibleCoupons.length) {
    const coupon = eligibleCoupons.sort(
      (a, b) => getCouponBenefitScore(b, cartTotal) - getCouponBenefitScore(a, cartTotal),
    )[0];

    return {
      type: "eligible",
      coupon: formatCoupon(coupon),
      message: buildCouponMessage(coupon, true),
    };
  }

  const promisingCoupons = availableCoupons
    .filter((coupon) =>
      ["MIN_ORDER_VALUE", "MIN_ORDERS_COUNT", "MIN_TOTAL_SPENT"].includes(
        coupon.eligibilityType,
      ),
    )
    .map((coupon) => {
      const history = couponHistory.find(
        (item) => String(item.couponId) === String(coupon._id),
      );
      const progress = getCouponProgress(coupon, customerStats);
      const benefitScore = getCouponBenefitScore(coupon, cartTotal);
      const suggestionPenalty = Number(history?.timesSuggested || 0) * 10;
      const closenessScore =
        progress.required > 0
          ? Math.max(0, 100 - (progress.missing / progress.required) * 100)
          : 50;

      return {
        coupon,
        progress,
        score: closenessScore + benefitScore - suggestionPenalty,
      };
    })
    .sort((a, b) => b.score - a.score);

  if (!promisingCoupons.length) {
    return {
      type: "none",
      coupon: null,
      message: "No coupon matches this cart yet.",
    };
  }

  const bestOffer = promisingCoupons[0];

  return {
    type: "promising",
    coupon: formatCoupon(bestOffer.coupon),
    progress: bestOffer.progress,
    message: buildCouponMessage(bestOffer.coupon, false, bestOffer.progress),
  };
}

async function recordCouponSuggestion(user, couponOffer) {
  if (!couponOffer?.coupon?._id) return;

  const couponId = couponOffer.coupon._id;
  const existingCoupon = user.coupons?.find(
    (coupon) => String(coupon.couponId) === String(couponId),
  );

  if (existingCoupon) {
    if (["APPLIED", "USED"].includes(existingCoupon.status)) return;

    const updateFields = {
      "coupons.$.lastSuggestedAt": new Date(),
    };

    if (existingCoupon.status !== "ASSIGNED") {
      updateFields["coupons.$.status"] = "SUGGESTED";
    }

    await User.updateOne(
      { _id: user._id, "coupons.couponId": couponId },
      {
        $inc: { "coupons.$.timesSuggested": 1 },
        $set: updateFields,
      },
    );
    return;
  }

  await User.updateOne(
    { _id: user._id },
    {
      $push: {
        coupons: {
          couponId,
          code: couponOffer.coupon.code,
          status: "SUGGESTED",
          timesSuggested: 1,
          lastSuggestedAt: new Date(),
        },
      },
    },
  );
}
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    let CartId = user.cart;

    if (!CartId) {
      return res.status(200).json({ message: "Cart not found" });
    }

    const [cart, vatConfig, addressOfUser] = await Promise.all([
      Cart.findById(CartId).populate({
        path: "products.productId",
        select:
          "_id title images shipping variants._id variants.sku variants.compareAtPrice",
        model: "Product",
      }),
      VAT_shipping.findOne({}).select("vat delivery").lean(),
      Address.findOne({ user: userId, isDefault: true })
        .select("street city state country zipCode")
        .lean(),
    ]);
    if (!cart) {
      return res.status(200).json({ message: "Cart not found" });
    }
    const vatRate = Number(vatConfig?.vat) || 0;
    const normalizedDelivery = (vatConfig?.delivery || []).map((delivery) => ({
      ...delivery,
      place: String(delivery.place || "")
        .trim()
        .toLowerCase(),
    }));

    const locationParts = [
      addressOfUser?.city,
      addressOfUser?.state,
      addressOfUser?.country,
      user.PersonalInfo?.location,
    ]
      .filter(Boolean)
      .map((part) => String(part).trim().toLowerCase());

    const exactShippingLocation = normalizedDelivery.find((delivery) =>
      locationParts.includes(delivery.place),
    );

    const shippingCost = Number(exactShippingLocation?.cost) || 0;
    const couponOffer = await evaluateCouponEligibility(user, cart);
    await recordCouponSuggestion(user, couponOffer);
    const requiredCart = {
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      couponOffer,
      items: cart.products.map((item) => ({
        _id: item.productId._id,
        title: item.productId.title,
        image: item.productId.images[0].url,
        price: item.price,
        variantId: item.variantId,
        sku: item.productId.variants.find(
          (variant) => String(variant._id) === String(item.variantId),
        )?.sku,
        compareAtPrice:
          item.productId.variants.find(
            (variant) => String(variant._id) === String(item.variantId),
          )?.compareAtPrice ?? 0,
        quantity: item.quantity,
        subtotal: item.subtotal,
        vat: item.subtotal * vatRate,
        shippingCost,
      })),
    };
    return res.status(200).json(requiredCart);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.SyncCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(req.body);
    const { productId: id, quantity, variantId } = req.body || [];
    const Quantity = Number(quantity);
    if (!id || !Quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let subtotal = 0;

    if (!userId) return res.status(401);
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const currentCart = await Cart.findOne({ userId });
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const Variant = product.variants.find(
      (variant) => variant._id.toString() === variantId,
    );
    //create new cart
    if (!currentCart) {
      const cart = await Cart.create({
        userId,
        products: [
          {
            productId: id,
            quantity: quantity,
            price: Variant.price,
            variantId: variantId,
            subtotal: Variant.price * quantity,
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalItems: 0,
        totalPrice: 0,
      });
      if (!cart)
        return res.status(500).json({ message: "Failed to create cart" });
      cart.totalItems = cart.products.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      cart.totalPrice = cart.products.reduce(
        (total, item) => total + item.subtotal,
        0,
      );
      await cart.save();
      user.cart = cart._id;
      const updatedUser = await user.save();
      if (!updatedUser)
        return res.status(500).json({ message: "Failed to update user" });

      return res.status(200).json({ message: "Cart created successfully" });
    }
    //update existing cart
    if (currentCart) {
      const existingProduct = currentCart.products.find(
        (item) =>
          item.productId.toString() === id &&
          item.variantId.toString() === variantId,
      );
      if (existingProduct) {
        subtotal = Quantity * existingProduct.price;
        currentCart.totalItems += Quantity - existingProduct.quantity;
        currentCart.totalPrice += subtotal - existingProduct.subtotal;
        existingProduct.quantity = Quantity;
        existingProduct.subtotal = subtotal;
        currentCart.updatedAt = Date.now();
      } else {
        currentCart.products.push({
          productId: id,
          variantId: variantId,
          quantity: Quantity,
          price: product.price,
          subtotal: product.price * Quantity,
        });
        currentCart.totalItems += Quantity;
        currentCart.totalPrice += product.price * Quantity;
        currentCart.updatedAt = Date.now();
      }
      const updatedCart = await currentCart.save();
      if (!updatedCart)
        return res.status(500).json({ message: "Failed to update cart" });
      return res.status(200).json({ message: "Cart updated successfully" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    await Cart.findByIdAndDelete(user.cart);
    user.cart = null;
    await user.save();
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const variantId = req.query.variantId;
    const productId = req.params.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const product = cart.products.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId,
    );
    if (!product)
      return res.status(404).json({ message: "Product not found in cart" });
    cart.products = cart.products.filter(
      (item) =>
        item.productId.toString() !== productId &&
        item.variantId.toString() !== variantId,
    );
    cart.totalItems -= product.quantity;
    cart.totalPrice -= product.subtotal;
    if (cart.totalItems < 0) cart.totalItems = 0;
    if (cart.totalPrice < 0) cart.totalPrice = 0;
    await cart.save();
    if (cart.products.length === 0) {
      await Cart.findByIdAndDelete(user.cart);
      user.cart = null;
      await user.save();
    }
    res.status(200).json({ message: "Product deleted from cart successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
