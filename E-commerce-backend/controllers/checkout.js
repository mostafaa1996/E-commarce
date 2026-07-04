const User = require("../models/User");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const VAT_delivery = require("../models/VAT");
const { Coupon } = require("../models/Coupons");
const checkoutService = require("../services/checkoutService");
exports.getCartData = async (req, res) => {
  const user = req.user;
  const cartId = user.cart;
  if (!cartId)
    return res.status(401).json({ message: "Cart not found", cart: {} });
  const reqCart = await Cart.findById(cartId);
  if (!reqCart)
    return res.status(401).json({ message: "Cart not found", cart: {} });

  await checkoutService.calculateShippingCost(reqCart, user._id);
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
