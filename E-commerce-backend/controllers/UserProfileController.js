const { join } = require("../getBaseProductsByRapidAPI/categories");
const User = require("../models/User");
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId).populate({
      path: "orders", 
      select: "orderItems Status totalPrice createdAt",
    });
    if (!user) return res.sendStatus(401);
    console.log(user);
    const contacts = {
      name: user.name,
      email: user.email,
      phone: user.billingDetails?.[0]?.phone,
      country: user.billingDetails?.[0]?.country,
      city: user.billingDetails?.[0]?.city,
      joinDate: user.createdAt,
    };
    const Addresses = user.billingDetails;
    const Orders = user.orders;
    const wishlist = user.wishlist;
    const notifications = user.notifications;
    const paymentMethods = user.paymentMethods;
    const StatsData = {
      totalOrders: user.orders?.length,
      totalSpent: user.orders?.reduce((total, order) => total + order.totalPrice, 0),
      totalWishlist: user.wishlist?.length,
      totalReviews: user.reviews?.length,
    };
    res
      .status(200)
      .json({ contacts, Addresses, Orders, wishlist, notifications , paymentMethods , StatsData });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
