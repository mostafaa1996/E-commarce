const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId).populate({
      path: "orders",
      select: "orderItems Status totalPrice createdAt",
    });
    if (!user) return res.sendStatus(401);
    // console.log(user);
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
      totalSpent: user.orders?.reduce(
        (total, order) => total + order.totalPrice,
        0,
      ),
      totalWishlist: user.wishlist?.length,
      totalReviews: user.reviews?.length,
    };
    res.status(200).json({
      contacts,
      Addresses,
      Orders,
      wishlist,
      notifications,
      paymentMethods,
      StatsData,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getPersonalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId).select("PersonalInfo");
    console.log(user);
    if (!user) return res.sendStatus(401);
    res.status(200).json(user?.PersonalInfo || {});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(401);
    if (!req.file)
      return res.sendStatus(400).json({ message: "No file uploaded" });
    const result = await UploadToCloudinary(req.file.buffer, userId);
    user.PersonalInfo.avatar.url = result.secure_url;
    await user.save();
    res.status(200).json({
      message: "Profile picture uploaded successfully",
      avatar: result.secure_url,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.UpdatePersonalInfo = async (req, res) => {
  try {
    console.log("Valid data");
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(401);
    await User.findByIdAndUpdate(userId, {
      $set: {
        "PersonalInfo.firstName": req.body.firstName,
        "PersonalInfo.lastName": req.body.lastName,
        "PersonalInfo.email": req.body.email,
        "PersonalInfo.phone": req.body.phone,
        "PersonalInfo.dateOfBirth": req.body.dateOfBirth,
        "PersonalInfo.gender": req.body.gender,
        "PersonalInfo.location": req.body.location,
        "PersonalInfo.Bio": req.body.Bio,
      },
    });
    await user.save();
    res.status(200).json({ message: "Personal info updated successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

function UploadToCloudinary(fileBuffer, userId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "E-commerce/Users",
        public_id: `user_${userId}`,
        overwrite: true,
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    stream.end(fileBuffer);
  });
}
