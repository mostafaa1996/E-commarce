const mongoose = require("mongoose");
const { Coupon, Discount } = require("../models/Coupons");
const Product = require("../models/Product");

const COUPON_TYPES = ["PERCENTAGE", "FIXED", "FREE_SHIPPING"];
const DISCOUNT_TYPES = ["PERCENTAGE", "FIXED"];
const STATUSES = ["ACTIVE", "INACTIVE", "EXPIRED", "USED"];

function ensureAdmin(req, res) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return false;
  }

  return true;
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function normalizeEnum(value, allowedValues, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const normalizedValue = String(value).trim().toUpperCase();

  if (!allowedValues.includes(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

function parseRequiredDate(value) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function parseNonNegativeNumber(value) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}

function normalizePositiveInteger(value, fallback) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return Math.floor(parsedValue);
}

function roundCurrency(value) {
  return Number(Number(value).toFixed(2));
}

function calculateDiscountedPrice(basePrice, type, value) {
  if (type === "PERCENTAGE") {
    return roundCurrency(basePrice - (basePrice * value) / 100);
  }

  return roundCurrency(basePrice - value);
}

function resolveCouponStatus(coupon) {
  const now = new Date();

  if (coupon.expireDate && new Date(coupon.expireDate) < now) {
    return "EXPIRED";
  }

  if (coupon.usageLimit > 0 && coupon.Usages >= coupon.usageLimit) {
    return "USED";
  }

  if (coupon.status === "INACTIVE") {
    return "INACTIVE";
  }

  return "ACTIVE";
}

function resolveDiscountStatus(discount) {
  if (discount.expireDate && new Date(discount.expireDate) < new Date()) {
    return "EXPIRED";
  }

  if (discount.usageLimit > 0 && discount.Usages >= discount.usageLimit) {
    return "USED";
  }

  if (discount.status === "INACTIVE") {
    return "INACTIVE";
  }

  return "ACTIVE";
}

function recalculateProductPricing(product) {
  const variantPrices = Array.isArray(product.variants)
    ? product.variants
        .map((variant) => Number(variant.price))
        .filter((price) => Number.isFinite(price))
    : [];

  if (variantPrices.length === 0) {
    return;
  }

  product.pricing = {
    minPrice: Math.min(...variantPrices),
    maxPrice: Math.max(...variantPrices),
  };
  product.price = product.pricing.minPrice;
  product.updatedAt = new Date();
}

async function syncDiscountedVariant({
  productId,
  variantId,
  type,
  value,
  title,
  expireDate,
  discountToUpdate = null,
}) {
  if (!isValidObjectId(productId)) {
    return { error: { status: 400, message: "Invalid product id." } };
  }

  if (!isValidObjectId(variantId)) {
    return { error: { status: 400, message: "Invalid variant id." } };
  }

  const product = await Product.findById(productId);

  if (!product) {
    return { error: { status: 404, message: "Product not found." } };
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    return { error: { status: 404, message: "Variant not found." } };
  }

  const activeDiscount = await Discount.findOne({
    productId: product._id,
    variantId: variant._id,
    _id: discountToUpdate ? { $ne: discountToUpdate._id } : { $exists: true },
    status: "ACTIVE",
    expireDate: { $gte: new Date() },
  });

  if (activeDiscount) {
    return {
      error: {
        status: 409,
        message: "An active discount already exists for this variant.",
      },
    };
  }

  const basePrice =
    Number(variant.compareAtPrice) > 0
      ? Number(variant.compareAtPrice)
      : Number(variant.price);

  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    return {
      error: {
        status: 400,
        message:
          "Variant price must be greater than zero before applying a discount.",
      },
    };
  }

  const discountedPrice = calculateDiscountedPrice(basePrice, type, value);

  if (discountedPrice < 0) {
    return {
      error: {
        status: 400,
        message: "Discount value cannot reduce the variant price below zero.",
      },
    };
  }

  variant.compareAtPrice = basePrice;
  variant.price = discountedPrice;
  variant.updatedAt = new Date();

  recalculateProductPricing(product);
  await product.save();

  const discount = discountToUpdate || new Discount();
  discount.productId = product._id;
  discount.variantId = variant._id;
  discount.title = String(title || product.title || "").trim();
  discount.sku = String(variant.sku || "");
  discount.type = type;
  discount.value = value;
  discount.expireDate = expireDate;
  discount.compareAtPrice = basePrice;
  discount.price = discountedPrice;
  discount.status = resolveDiscountStatus({ expireDate });

  await discount.save();

  return {
    product,
    variant,
    discount,
  };
}

async function restoreVariantPriceFromDiscount(discount) {
  const product = await Product.findById(discount.productId);

  if (!product) {
    return null;
  }

  const variant = product.variants.id(discount.variantId);

  if (!variant) {
    return product;
  }

  variant.price = Number(
    discount.compareAtPrice || variant.compareAtPrice || variant.price,
  );
  variant.compareAtPrice = 0;
  variant.updatedAt = new Date();

  recalculateProductPricing(product);
  await product.save();

  return product;
}

exports.createCouponForCustomer = async (req, res, next) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const body = req.body || {};
    const code = String(body.code || "")
      .trim()
      .toUpperCase();
    const type = normalizeEnum(body.type, COUPON_TYPES, "PERCENTAGE");
    const expireDate = parseRequiredDate(body.expireDate);
    const value = parseNonNegativeNumber(body.value ?? 0);
    const usageLimit = parseNonNegativeNumber(body.usageLimit ?? 0);
    const minOrder = parseNonNegativeNumber(body.minOrder ?? 0);
    const usages = parseNonNegativeNumber(body.usages ?? 0);

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required." });
    }

    if (!type) {
      return res.status(400).json({ message: "Invalid coupon type." });
    }

    if (!expireDate) {
      return res
        .status(400)
        .json({ message: "A valid expireDate is required." });
    }

    if (value === null) {
      return res
        .status(400)
        .json({ message: "Coupon value must be a non-negative number." });
    }

    if (usageLimit === null || minOrder === null || usages === null) {
      return res
        .status(400)
        .json({ message: "Coupon numeric fields must be non-negative." });
    }

    if (type === "PERCENTAGE" && value > 100) {
      return res
        .status(400)
        .json({ message: "Percentage coupon value cannot exceed 100." });
    }

    if (type === "FREE_SHIPPING" && value !== 0) {
      return res
        .status(400)
        .json({ message: "FREE_SHIPPING coupons must have value 0." });
    }

    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      return res.status(409).json({ message: "Coupon code already exists." });
    }

    const coupon = await Coupon.create({
      code,
      type,
      value,
      expireDate,
      usages: usages,
      usageLimit,
      minOrder,
      status: resolveCouponStatus({
        expireDate,
        Usages: usages,
        usageLimit,
      }),
    });

    return res.status(201).json({
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (err) {
    next(err);
  }
};

exports.createDiscountForProduct = async (req, res, next) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const body = req.body || {};
    const productId = body.productId;
    const variantId = body.variantId;
    const title = String(body.title || "").trim();
    const type = normalizeEnum(body.type, DISCOUNT_TYPES, "PERCENTAGE");
    const value = parseNonNegativeNumber(body.value ?? 0);
    const expireDate = parseRequiredDate(body.expireDate);

    if (!title) {
      return res.status(400).json({ message: "Discount title is required." });
    }

    if (!type) {
      return res.status(400).json({ message: "Invalid discount type." });
    }

    if (value === null) {
      return res
        .status(400)
        .json({ message: "Discount value must be a non-negative number." });
    }

    if (type === "PERCENTAGE" && value > 100) {
      return res
        .status(400)
        .json({ message: "Percentage discount value cannot exceed 100." });
    }

    if (!expireDate) {
      return res
        .status(400)
        .json({ message: "A valid expireDate is required." });
    }

    const result = await syncDiscountedVariant({
      productId,
      variantId,
      type,
      value,
      title,
      expireDate,
    });

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    }

    return res.status(201).json({
      message: "Discount created successfully.",
      discount: result.discount,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCouponForCustomer = async (req, res, next) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid coupon id." });
    }

    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    return res.status(200).json({
      message: "Coupon deleted successfully.",
      coupon: deletedCoupon,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteDiscountForProduct = async (req, res, next) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid discount id." });
    }

    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({ message: "Discount not found." });
    }

    await restoreVariantPriceFromDiscount(discount);
    await Discount.deleteOne({ _id: discount._id });

    return res.status(200).json({
      message: "Discount deleted successfully.",
      discount,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCouponForCustomer = async (req, res, next) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid coupon id." });
    }

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    const body = req.body || {};
    console.log(body);

    if (body.code !== undefined) {
      const nextCode = String(body.code || "")
        .trim()
        .toUpperCase();

      if (!nextCode) {
        return res
          .status(400)
          .json({ message: "Coupon code cannot be empty." });
      }

      const duplicatedCode = await Coupon.findOne({
        code: nextCode,
        _id: { $ne: coupon._id },
      });

      if (duplicatedCode) {
        return res.status(409).json({ message: "Coupon code already exists." });
      }

      coupon.code = nextCode;
    }

    if (body.type !== undefined) {
      const nextType = normalizeEnum(body.type, COUPON_TYPES, coupon.type);

      if (!nextType) {
        return res.status(400).json({ message: "Invalid coupon type." });
      }

      coupon.type = nextType;
    }

    if (body.expireDate !== undefined) {
      const nextExpireDate = parseRequiredDate(body.expireDate);

      if (!nextExpireDate) {
        return res
          .status(400)
          .json({ message: "A valid expireDate is required." });
      }

      coupon.expireDate = nextExpireDate;
    }

    if (body.value !== undefined) {
      const nextValue = parseNonNegativeNumber(body.value);

      if (nextValue === null) {
        return res
          .status(400)
          .json({ message: "Coupon value must be a non-negative number." });
      }

      coupon.value = nextValue;
    }

    if (body.usageLimit !== undefined) {
      const nextusageLimit = parseNonNegativeNumber(body.usageLimit);

      if (nextusageLimit === null) {
        return res
          .status(400)
          .json({ message: "usageLimit must be a non-negative number." });
      }
      console.log(nextusageLimit);
      coupon.usageLimit = nextusageLimit;
    }

    if (body.minOrder !== undefined) {
      const nextMinOrder = parseNonNegativeNumber(body.minOrder);

      if (nextMinOrder === null) {
        return res
          .status(400)
          .json({ message: "minOrder must be a non-negative number." });
      }

      coupon.minOrder = nextMinOrder;
    }

    if (coupon.type === "PERCENTAGE" && coupon.value > 100) {
      return res
        .status(400)
        .json({ message: "Percentage coupon value cannot exceed 100." });
    }

    // if (coupon.type === "FREE_SHIPPING") {
    //   coupon.value = 0;
    // }

    if (body.active !== undefined ) {
      const reqStatus = body.active ? "ACTIVE" : "INACTIVE";
      const nextStatus = normalizeEnum(reqStatus, STATUSES, coupon.status);

      if (!nextStatus) {
        return res.status(400).json({ message: "Invalid coupon status." });
      }

      coupon.status = nextStatus;
    } else {
      coupon.status = resolveCouponStatus(coupon);
    }

    await coupon.save();

    return res.status(200).json({
      message: "Coupon updated successfully.",
      coupon,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateDiscountForProduct = async (req, res, next) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid discount id." });
    }

    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({ message: "Discount not found." });
    }

    const body = req.body || {};
    const type =
      body.type !== undefined
        ? normalizeEnum(body.type, DISCOUNT_TYPES, discount.type)
        : discount.type;
    const value =
      body.value !== undefined
        ? parseNonNegativeNumber(body.value)
        : discount.value;
    const expireDate =
      body.expireDate !== undefined
        ? parseRequiredDate(body.expireDate)
        : discount.expireDate;
    const title =
      body.title !== undefined
        ? String(body.title || "").trim()
        : discount.title;
    const productId = body.productId || discount.productId;
    const variantId = body.variantId || discount.variantId;

    if (!title) {
      return res.status(400).json({ message: "Discount title is required." });
    }

    if (!type) {
      return res.status(400).json({ message: "Invalid discount type." });
    }

    if (value === null) {
      return res
        .status(400)
        .json({ message: "Discount value must be a non-negative number." });
    }

    if (type === "PERCENTAGE" && value > 100) {
      return res
        .status(400)
        .json({ message: "Percentage discount value cannot exceed 100." });
    }

    if (!expireDate) {
      return res
        .status(400)
        .json({ message: "A valid expireDate is required." });
    }

    if (
      String(productId) !== String(discount.productId) ||
      String(variantId) !== String(discount.variantId)
    ) {
      await restoreVariantPriceFromDiscount(discount);
    }

    const result = await syncDiscountedVariant({
      productId,
      variantId,
      type,
      value,
      title,
      expireDate,
      discountToUpdate: discount,
    });

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    }

    if (body.active !== undefined) {
      const reqStatus = body.active ? "ACTIVE" : "INACTIVE";
      const nextStatus = normalizeEnum(
        reqStatus,
        STATUSES,
        result.discount.status,
      );

      if (!nextStatus) {
        return res.status(400).json({ message: "Invalid discount status." });
      }

      result.discount.status = nextStatus;
      await result.discount.save();

      if (reqStatus === "INACTIVE") {
        await restoreVariantPriceFromDiscount(result.discount);
      }
    }

    return res.status(200).json({
      message: "Discount updated successfully.",
      discount: result.discount,
      product: {
        _id: result.product._id,
        variantId: result.variant._id,
        sku: result.variant.sku,
        compareAtPrice: result.variant.compareAtPrice,
        price: result.variant.price,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getCouponsAndDiscounts = async (req, res, next) => {
  try {
    if (!ensureAdmin(req, res)) {
      return;
    }

    const couponsPage = normalizePositiveInteger(req.query.CouponsPage, 1);
    const productsPage = normalizePositiveInteger(req.query.ProductsPage, 1);
    const limit = Math.min(normalizePositiveInteger(req.query.limit, 5), 100);
    const couponsSkip = (couponsPage - 1) * limit;
    const discountsSkip = (productsPage - 1) * limit;
    const now = new Date();

    const [
      pagedCoupons,
      pagedDiscounts,
      couponsCount,
      discountsCount,
      activeCouponsCount,
      activeDiscountsCount,
    ] = await Promise.all([
      Coupon.find().sort({ createdAt: -1 }).skip(couponsSkip).limit(limit),
      Discount.find().sort({ createdAt: -1 }).skip(discountsSkip).limit(limit),
      Coupon.countDocuments(),
      Discount.countDocuments(),
      Coupon.countDocuments({
        expireDate: { $gte: now },
        $expr: {
          $or: [
            { $eq: ["$usageLimit", 0] },
            { $gt: ["$usageLimit", "$Usages"] },
          ],
        },
      }),
      Discount.countDocuments({
        expireDate: { $gte: now },
      }),
    ]);

    await Promise.all(
      pagedCoupons.map(async (coupon) => {
        const nextStatus = resolveCouponStatus(coupon);
        if (
          nextStatus === "INACTIVE" ||
          nextStatus === "EXPIRED" ||
          nextStatus === "USED"
        ) {
          await restoreVariantPriceFromCoupon(coupon);
        }
        coupon.status = nextStatus;
        return coupon.save();
      }),
    );

    await Promise.all(
      pagedDiscounts.map(async (discount) => {
        const nextStatus = resolveDiscountStatus(discount);

        if (nextStatus === "INACTIVE" || nextStatus === "EXPIRED") {
          await restoreVariantPriceFromDiscount(discount);
          discount.price = discount.compareAtPrice;
          discount.compareAtPrice = 0;
        }
        discount.status = nextStatus;
        return discount.save();
      }),
    );

    const couponsTotalPages = Math.max(1, Math.ceil(couponsCount / limit));
    const discountsTotalPages = Math.max(1, Math.ceil(discountsCount / limit));

    return res.status(200).json({
      message: "Coupons and discounts fetched successfully.",
      summary: {
        couponsCount,
        activeCouponsCount,
        discountsCount,
        activeDiscountsCount,
      },
      pagination: {
        coupons: {
          page: couponsPage,
          limit,
          totalItems: couponsCount,
          totalPages: couponsTotalPages,
          hasNextPage: couponsPage < couponsTotalPages,
          hasPrevPage: couponsPage > 1,
        },
        discounts: {
          page: productsPage,
          limit,
          totalItems: discountsCount,
          totalPages: discountsTotalPages,
          hasNextPage: productsPage < discountsTotalPages,
          hasPrevPage: productsPage > 1,
        },
      },
      coupons: pagedCoupons,
      discounts: pagedDiscounts,
    });
  } catch (err) {
    next(err);
  }
};
