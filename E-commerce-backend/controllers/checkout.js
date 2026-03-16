const User = require("../models/User");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const VAT_shipping = require("../models/VAT");
exports.getCartData = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.sendStatus(401);
  const user = await User.findById(userId);
  if (!user) return res.sendStatus(401);
  const cart = user.cart;
  if (!cart)
    return res.status(401).json({ message: "Cart not found", cart: {} });
  let reqCart = await Cart.findById(cart);
  if (!reqCart)
    return res.status(401).json({ message: "Cart not found", cart: {} });
  const createdVAT_shipping = await VAT_shipping.findOne({});
  if (!createdVAT_shipping)
    return res.status(401).json({ message: "VAT not found", cart: {} });

  res.status(200).json({
    message: "Cart found",
    cart: reqCart,
    VAT_shipping: createdVAT_shipping,
  });
};

exports.getShippingDetails = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ message: "User not found" });
  const reqAddress = await Address.findOne({ user: userId, isDefault: true });
  if (!reqAddress)
    return res.status(401).json({ message: "Address not found", shippingDetails: {} });
  const shippingDetails = {
    firstName: reqAddress.name.split(" ")[0] || "",
    lastName: reqAddress.name.split(" ")[1] || "",
    email: reqAddress.email || "",
    phone: reqAddress.phone || "",
    companyName: reqAddress.label || "",
    city: reqAddress.city || "",
    state: reqAddress.state || "",
    country: reqAddress.country || "",
    postalCode: reqAddress.zipCode || "",
    street: reqAddress.street || "",
    Apartment: reqAddress.street.split(",")[0] || "",
    building: reqAddress.street.split(",")[1] || "",
  };
  res.status(200).json({shippingDetails: shippingDetails , message: "Shipping details found"});
};
