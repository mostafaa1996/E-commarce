const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const user = await User.findById(userId);
  let CartId = user.cart;

  if (!CartId) {
    return res.status(200).json({ items: [], totalItems: 0, totalPrice: 0 });
  }

  let cart = await Cart.findById(CartId);
  if (!cart) {
    return res.status(200).json({ items: [], totalItems: 0, totalPrice: 0 });
  }

  return res.status(200).json(cart);
};

exports.SyncCart = async (req, res) => {
  const userId = req.user.id;
  const guestCart = req.body || [];

  if (!userId) return res.status(401);
  const user = await User.findById(userId);

  if (guestCart?.items?.length > 0 && user.cart === null) {
    const cart = await Cart.create({
      userId: userId,
      products: guestCart.items,
      totalItems: guestCart.totalItems,
      totalPrice: guestCart.totalPrice,
      createdAt: Date.now(),
    });
    if (!cart)
      return res.status(500).json({ message: "Failed to create cart" });
    user.cart = cart._id;
    const updatedUser = await user.save();
    if (!updatedUser)
      return res.status(500).json({ message: "Failed to update user" });

    return res.status(200).json({ message: "Cart synced successfully" });
  }
  return res.status(200).json({ message: "Clear cart first" });
};
