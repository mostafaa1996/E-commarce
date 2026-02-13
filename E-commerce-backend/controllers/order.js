const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const orderItems = await Promise.all(
      req.body.cartInfo.items.map(async (item) => {
        const product = await Product.findById(item._id);
        if (!product) throw new Error("Product not found");
        return {
          product: product._id,
          name: product.title,
          image: product.images[0].url,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );
    const itemsPrice = orderItems.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );
    const notes = req.body.orderNotes;
    const shippingAddress = req.body.shippingDetails;
    const paymentMethod = req.body.paymentMethod;
    const Status = {
      status: "pending_Payment",
      update_time: new Date().toISOString(),
    };
    const orderUser = user._id;
    const shippingPrice = 0;
    const taxPrice = 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    const order = await Order.create({
      orderItems,
      notes,
      shippingAddress,
      paymentMethod,
      Status,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: orderUser,
    });
    if(req.body.shippingDetailsmodified === true){
        user.billingDetails = user.billingDetails || []; // in case it is undefined first time to checkout..
        user.billingDetails = user.billingDetails.filter((item) => (item._id.toString() !== req.body.shippingDetails._id.toString())) ;
        //sanitize the shipping details
        const cleanedShippingDetails = {
            _id: req.body.shippingDetails._id,
            firstName: req.body.shippingDetails.firstName,
            lastName: req.body.shippingDetails.lastName,
            email: req.body.shippingDetails.email,
            companyName: req.body.shippingDetails.company,
            country: req.body.shippingDetails.country,
            city: req.body.shippingDetails.city,
            state: req.body.shippingDetails.state,
            street : req.body.shippingDetails.street,
            phone: req.body.shippingDetails.phone,
            Apartment: req.body.shippingDetails.Apartment,
            postalCode: req.body.shippingDetails.postalCode,
            isDefault: req.body.shippingDetails.isDefault
        }
        user.billingDetails.push(cleanedShippingDetails);
        await user.save();
    }
    res
      .status(201)
      .json({
        orderId: order._id,
        nextAction: "payment",
        message: "Order created successfully",
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
