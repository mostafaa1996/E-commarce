const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Address = require("../models/Address");
const { Coupon } = require("../models/Coupons");
const cartService = require("../services/CartService");

exports.getCart = async (req, res, next) => {
  try {
    let couponInCart = null;
    const user = req.user;
    const eligibility = req.coupon;
    let CartId = user.cart;

    if (!CartId) {
      return res.status(200).json({ message: "Cart not found" });
    }

    const cart = await Cart.findById(CartId).populate({
      path: "products.productId",
      select:
        "_id title images shipping variants._id variants.sku variants.compareAtPrice",
      model: "Product",
    });

    if (!cart) {
      return res.status(200).json({ message: "Cart not found" });
    }
    
    if (cart.promo.code) {
      couponInCart = await Coupon.findOne({ 
        code: cart.promo.code,
        status: "ACTIVE",
        startDate: { $lte: Date.now() },
        expireDate: { $gte: Date.now() },
        $or: [
          { usageLimit: 0 },
          { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
        ],
       });
    }

    const totalPrice = cart.totalPrice;
    const discount = cart.promo?.discountInMoney || 0;
    const subtotalAfterDiscount = Math.max(cart.itemsPrice - discount, 0);
    cart.totalPrice = cart.TAX + cart.shippingCost + subtotalAfterDiscount;
    if(cart.totalPrice !== totalPrice){
      await cart.save();
    }

    const requiredCart = {
      totalItems: cart.totalItems,
      itemsPrice: cart.itemsPrice,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      couponOffer: couponInCart? couponInCart : eligibility || null,
      shippingCost: cart.shippingCost,
      vat: cart.TAX,
      totalPrice: cart.totalPrice,
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
    const user = req.user;
    const { productId: id, quantity, variantId } = req.body || [];
    const Quantity = Number(quantity);
    if (!id || !variantId || !Number.isInteger(Quantity) || Quantity <= 0) {
      return res.status(400).json({ message: "Invalid cart item" });
    }
    const result = await cartService.getProductWithVariant(id, variantId);

    if (!result) {
      return res.status(404).json({
        message: "Product or variant not found",
      });
    }

    const { product, Variant } = result;
    const currentCart = await cartService.checkCartAvailability(user._id);
    //create new cart
    if (currentCart === null) {
      const cart = await Cart.create({
        userId: user._id,
        products: [
          {
            productId: id,
            quantity: Quantity,
            price: Variant.price,
            variantId: variantId,
            subtotal: Variant.price * Quantity,
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalItems: 0,
        totalPrice: 0,
        itemsPrice: 0,
      });
      cart.totalItems = cart.products.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      cart.itemsPrice = cart.products.reduce(
        (total, item) => total + item.subtotal,
        0,
      );
      await cartService.calculateTax(cart);
      await cart.save();
      user.cart = cart._id;
      const updatedUser = await user.save();
      if (!updatedUser)
        return res.status(500).json({ message: "Failed to update user" });

      return res.status(200).json({ message: "Cart created successfully" });
    }
    //update existing cart
    if (currentCart) {
      const existingProduct = await cartService.checkItemAvailability(
        currentCart,
        id,
        variantId,
      );
      if (existingProduct) {
        await cartService.UpdatingExistingItem(
          currentCart,
          existingProduct,
          Quantity,
        );
      } else {
        await cartService.addingNewProduct(
          currentCart,
          product,
          Variant,
          Quantity,
        );
      }
      await cartService.calculateTax(currentCart);
      const updatedCart = await currentCart.save();

      return res.status(200).json({ message: "Cart updated successfully" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const user = req.user;
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
    const user = req.user;
    const variantId = req.query.variantId;
    const productId = req.params.id;

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const itemIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId,
    );
    if (itemIndex === -1)
      return res.status(404).json({ message: "Product not found in cart" });

    cart.products.splice(itemIndex, 1);
    cart.totalItems = cart.products.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    cart.itemsPrice = cart.products.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    if (cart.products.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      user.cart = null;
      await user.save();
      return res.status(200).json({ message: "Cart is now empty" });
    }
    await cartService.calculateTax(cart);
    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json({ message: "Product deleted from cart successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.applyPromoCode = async (req, res, next) => {
  try {
    let promoDiscountInMoney;
    const user = req.user;
    const eligibility = req.coupon;
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const rawPromoCode = req.body?.promoCode;
    if (!rawPromoCode)
      return res.status(400).json({ message: "Promo code is required" });
    if (typeof rawPromoCode !== "string")
      return res
        .status(400)
        .json({ message: "A valid promo code is required" });
    const promoCode = rawPromoCode.trim();
    const coupon = await Coupon.findOne({
      code: promoCode,
      status: "ACTIVE",
      startDate: { $lte: Date.now() },
      expireDate: { $gte: Date.now() },
    });
    if (!coupon) {
      return res.status(404).json({
        message: "Coupon is invalid or expired",
      });
    }
    if (!eligibility || String(eligibility.coupon?._id) !== String(coupon._id)) {
      return res.status(400).json({ message: "Coupon is not eligible" });
    }
    if (coupon.discountType.toLowerCase() === "percentage") {
      promoDiscountInMoney = cart.itemsPrice * (coupon.discountValue / 100);
    } else if (coupon.discountType.toLowerCase() === "fixed") {
      promoDiscountInMoney = Math.min(coupon.discountValue, cart.itemsPrice);
    } else if (coupon.discountType.toLowerCase() === "free_shipping") {
      cart.promo.code = promoCode;
      cart.promo.appliedAt = Date.now();
      cart.promo.discountInMoney = 0;
      await cart.save();
      return res
        .status(200)
        .json({ message: " Promo code will be applied at checkout" });
    }
    cart.promo.code = promoCode;
    cart.promo.appliedAt = Date.now();
    cart.promo.discountInMoney = promoDiscountInMoney;
    await cart.save();
    res.status(200).json({ message: "Promo code applied successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
