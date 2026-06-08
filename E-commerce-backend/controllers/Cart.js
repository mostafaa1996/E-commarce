const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const VAT_shipping = require("../models/VAT");
const Address = require("../models/Address");
const { Coupon } = require("../models/Coupons");

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const coupon = req.coupon;
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

    cart.shippingCost = Number(exactShippingLocation?.cost) || 0;
    const discount = cart.promo?.discountInMoney || 0;
    const subtotalAfterDiscount = Math.max(cart.itemsPrice - discount, 0);
    cart.TAX = subtotalAfterDiscount * vatRate;
    cart.totalPrice = cart.TAX + cart.shippingCost + subtotalAfterDiscount;
    await cart.save();
    let couponInCart = null;
    if (cart.promo.code) {
      couponInCart = await Coupon.findOne({ code: cart.promo.code });
    }

    const requiredCart = {
      totalItems: cart.totalItems,
      totalPrice: cart.itemsPrice,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      couponOffer: coupon || couponInCart || null,
      shippingCost: cart.shippingCost,
      vat: cart.TAX,
      totalCost: cart.totalPrice,
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
        itemsPrice: 0,
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
      cart.itemsPrice = cart.products.reduce(
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
        currentCart.itemsPrice += subtotal - existingProduct.subtotal;
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
        currentCart.itemsPrice += product.price * Quantity;
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
    cart.itemsPrice = cart.totalPrice;
    if (cart.totalItems < 0) {
      cart.totalItems = 0;
      cart.totalPrice = 0;
      cart.itemsPrice = 0;
    }
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

exports.applyPromoCode = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const { promoCode } = req.body;
    if (!promoCode)
      return res.status(400).json({ message: "Promo code is required" });
    if (typeof promoCode !== "string")
      return res
        .status(400)
        .json({ message: "Promo code must be a string" });
    cart.promo.code = promoCode;
    cart.promo.appliedAt = Date.now();
    const coupon = await Coupon.findOne({ code: promoCode });
    if (coupon) {
      if (coupon.discountType.toLowerCase() === "percentage") {
        promoDiscountInMoney =
          reqCart.itemsPrice * (coupon.discountValue / 100);
      } else {
        promoDiscountInMoney = coupon.discountValue;
      }
      cart.promo.discountInMoney = promoDiscountInMoney;
    }
    await cart.save();
    res.status(200).json({ message: "Promo code applied successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
