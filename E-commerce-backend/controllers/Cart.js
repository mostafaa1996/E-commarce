const User = require("../models/User");
const Product = require("../models/Product");
exports.getCart = async (req, res) => {
  const userId = req.user.id;
  const guestCart = req.body.state?.items || {};

  if (!userId) return res.sendStatus(401);
  const user = await User.findById(userId);

  if (!user.cart) {
    user.cart = { items: [], totalItems: 0, total: 0, updatedAt: new Date() };
  }

  if (guestCart.length > 0) {
    guestCart.forEach((item) => {
      const existing = user.cart.items.find(
        (i) => i.productId.toString() === item._id.toString()
      );

      if (existing) {
        existing.quantity = item.quantity;
      } else {
        user.cart.items.push({ productId: item._id, quantity: item.quantity });
      }
    });

    user.cart.updatedAt = new Date();
    user.cart.totalItems = user.cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const items = await Promise.all(
      user.cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return { ...item, price: product.price };
      })
    );
    
    user.cart.totalPrice = items.reduce(
      (total, item) => total + item._doc.quantity * item.price,
      0
    );
    await user.save();
  } else {
    let Cart = {};
    const CartItems = await Promise.all(
      user.cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          _id: item.productId,
          quantity: item.quantity,
          price: product.price,
          image: product.images[0].url,
          title: product.title,
          subTotal: item.quantity * product.price,
        };
      })
    );
    const totalItems = CartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const totalPrice = CartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    Cart = {
      items: CartItems,
      totalItems,
      totalPrice,
    };
    return res.status(200).json(Cart);
  }

  res.status(200).json(user.cart);
};
