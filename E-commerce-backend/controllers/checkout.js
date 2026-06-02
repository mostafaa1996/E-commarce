const User = require("../models/User");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const VAT_delivery = require("../models/VAT");
const { Coupon } = require("../models/Coupons");
exports.getCartData = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.sendStatus(401);
  const user = await User.findById(userId);
  if (!user) return res.sendStatus(401);
  const cart = user.cart;
  if (!cart)
    return res.status(401).json({ message: "Cart not found", cart: {} });
  const reqCart = await Cart.findById(cart);
  if (!reqCart)
    return res.status(401).json({ message: "Cart not found", cart: {} });

  res.status(200).json({
    message: "Cart found",
    cart: {...reqCart.toObject() , PriceAfterCoupon: reqCart.itemsPrice - reqCart.promo.discountInMoney},
  });
};
