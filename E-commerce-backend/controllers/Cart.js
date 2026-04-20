const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    let CartId = user.cart;

    if (!CartId) {
      return res.status(200).json({ message: "Cart not found" });
    }

    let cart = await Cart.findById(CartId).populate({
      path: "products.productId",
      select: "_id title images ",
      model: "Product",
    });
    if (!cart) {
      return res.status(200).json({ message: "Cart not found" });
    }
    const requiredCart = {
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: cart.products.map((item) => ({
        _id: item.productId._id,
        title: item.productId.title,
        image: item.productId.images[0].url,
        price: item.price,
        variantId: item.variantId,
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
    const { productId: id, quantity , variantId } = req.body || [];
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
    const Variant = product.variants.find((variant) => variant._id.toString() === variantId); 
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
            subtotal: product.price * quantity,
          },
        ],
        totalItems: quantity,
        totalPrice: product.price * quantity,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      if (!cart)
        return res.status(500).json({ message: "Failed to create cart" });
      user.cart = cart._id;
      const updatedUser = await user.save();
      if (!updatedUser)
        return res.status(500).json({ message: "Failed to update user" });

      return res.status(200).json({ message: "Cart created successfully" });
    }
    //update existing cart
    if (currentCart) {
      const existingProduct = currentCart.products.find(
        (item) => item.productId.toString() === id,
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
      (item) => item.productId.toString() === productId && item.variantId.toString() === variantId,
    );
    if (!product)
      return res.status(404).json({ message: "Product not found in cart" });
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId && item.variantId.toString() !== variantId,
    );
    cart.totalItems -= product.quantity;
    cart.totalPrice -= product.subtotal;
    if (cart.totalItems < 0) cart.totalItems = 0;
    if (cart.totalPrice < 0) cart.totalPrice = 0;
    await cart.save();
    if(cart.products.length === 0){ 
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
