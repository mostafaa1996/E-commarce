const {Coupon} = require("../models/Coupons");
const User = require("../models/User");
const Cart = require("../models/Cart");

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
    return `You are eligible for coupon with code : ${coupon.code} - ${discountLabel}. Apply it before checkout.`;
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

exports.generateCouponOffer = async(req, res, next) => {
  try{
    const userId = req.user.id;
    if(!userId) return res.sendStatus(401).json({message: "Unauthorized"});
    const user = await User.findById(userId);
    if(!user) return res.sendStatus(401).json({message: "User not found"});
    const cart = await Cart.findOne({userId});
    if(!cart) return res.sendStatus(404).json({message: "Cart not found"});
    const coupon = await evaluateCouponEligibility(user , cart);
    if(!coupon) return res.sendStatus(404).json({message: "Coupon not found"});
    await recordCouponSuggestion(user, coupon);
    console.log("coupon .............. ", coupon);
    req.coupon = coupon;
    next();
  } catch(err){
      console.log(err);
      next(err)
  } 
}

exports.ApplyCoupon = async(req,res,next) => {
    
}