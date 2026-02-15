const User = require("../models/User");
exports.getCheckoutData = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.sendStatus(401);
  const user = await User.findById(userId);
  if(!user) return res.sendStatus(401);
  
  let checkoutData = {} ;
  checkoutData.cart = user.cart;
  checkoutData.shippingDetails = user.billingDetails.filter((item)=> item.isDefault === true)[0];
  checkoutData.paymentDetails = user.paymentMethods;
  res.status(200).json(checkoutData); 
};