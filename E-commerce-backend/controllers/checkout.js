const User = require("../models/User");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const VAT_delivery = require("../models/VAT");
exports.getCartData = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.sendStatus(401);
  const user = await User.findById(userId);
  if (!user) return res.sendStatus(401);
  const cart = user.cart;
  if (!cart)
    return res.status(401).json({ message: "Cart not found", cart: {} });
  const [reqCart, createdVAT_delivery, defaultAddress] = await Promise.all([
    Cart.findById(cart),
    VAT_delivery.findOne({}).lean(),
    Address.findOne({ user: userId, isDefault: true })
      .select("street city state country zipCode")
      .lean(),
  ]);
  if (!reqCart)
    return res.status(401).json({ message: "Cart not found", cart: {} });
  if (!createdVAT_delivery)
    return res.status(401).json({ message: "VAT not found", cart: reqCart , VAT_shipping: {}});

  const userLocation = [
    defaultAddress?.street,
    defaultAddress?.city,
    defaultAddress?.state,
    defaultAddress?.country,
    defaultAddress?.zipCode,
    user.PersonalInfo?.location,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const deliveryOptions = createdVAT_delivery.delivery || [];
  const exactShippingLocation = deliveryOptions.reduce(
    (best, delivery) => {
      const place = String(delivery.place || "").trim().toLowerCase();
      if (!place || !userLocation.includes(place)) return best;
      return !best || place.length > String(best.place).length
        ? delivery
        : best;
    },
    null,
  );
  const anyShippingLocation = deliveryOptions.find(
    (delivery) => String(delivery.place || "").trim().toLowerCase() === "any",
  );
  const shippingLocation = exactShippingLocation || anyShippingLocation;
  const shippingCost = Number(shippingLocation?.cost) || 0;

  res.status(200).json({
    message: "Cart found",
    cart: reqCart,
    VAT_shipping: {
      ...createdVAT_delivery,
      shippingCost,
      shippingLocation: shippingLocation?.place || null,
    },
  });
};
