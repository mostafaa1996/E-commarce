const User = require("../models/User");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const VAT_delivery = require("../models/VAT");
const { Coupon } = require("../models/Coupons");
const Product = require("../models/Product");
const checkoutService = require("../services/checkoutService");
const BuyNowCart = require("../models/BuyNowCart");
exports.getCartData = async (req, res) => {
  const user = req.user;
  const cartId = user.cart;
  if (!cartId)
    return res.status(401).json({ message: "Cart not found", cart: {} });
  const reqCart = await Cart.findById(cartId);
  if (!reqCart)
    return res.status(401).json({ message: "Cart not found", cart: {} });

  reqCart.shippingCost = await checkoutService.calculateShippingCost(user._id);
  reqCart.totalPrice = await checkoutService.updateFinalTotalPrice(
    reqCart.shippingCost,
    reqCart,
  );

  const updatedCart = await reqCart.save();

  res.status(200).json({
    message: "Cart found",
    cart: {
      ...updatedCart.toObject(),
      PriceAfterCoupon: Math.max(
        updatedCart.itemsPrice - (updatedCart.promo.discountInMoney || 0),
        0,
      ).toFixed(2),
    },
  });
};

exports.prepareCartForBuyNow = async (req, res, next) => {
  const user = req.user;
  const { productId, variantId, quantity } = req.query;
  const Quantity = Number(quantity);
  const product = await Product.findById(productId);
  const variant = await product?.variants?.find((v) => v._id == variantId);
  const taxConfig = await VAT_delivery.findOne({}).select("vat").lean();
  const vatRate = Number(taxConfig?.vat) || 0;
  if (!variant || !product)
    return res.status(404).json({ message: "product or variant not found" });
  let cart = {};
  cart.products = [
    {
      productId,
      variantId,
      quantity: Quantity,
      price: variant.price || 0,
      subtotal: (variant.price || 0) * Quantity,
    },
  ];

  cart.shippingCost = await checkoutService.calculateShippingCost(user._id);
  cart.totalItems = Quantity;
  cart.itemsPrice = cart.products.reduce(
    (total, item) => total + item.subtotal,
    0,
  );
  cart.TAX = cart.itemsPrice * vatRate;
  cart.totalPrice =
    cart.itemsPrice + Number(cart.shippingCost) + Number(cart.TAX);
  cart.currency = "USD";
  cart.userId = user._id;
  cart.cartType = "BUY_NOW";

  await BuyNowCart.deleteMany({ userId: user._id });

  const createdBuyNowCart = await BuyNowCart.create(cart);

  res
    .status(200)
    .json({ message: "Cart prepared for checkout", cart: createdBuyNowCart });
};
