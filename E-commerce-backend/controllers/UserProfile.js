const User = require("../models/User");
const Product = require("../models/Product");
const Address = require("../models/Address");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");

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
exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId)
      .populate({
        path: "orders",
        select: "orderItems Status totalPrice createdAt",
        limit: 4,
      })
      .populate({
        path: "Addresses",
        limit: 3,
      }).populate({
        path: "wishlist",
        limit: 3,
      });
    if (!user) return res.sendStatus(401);
    // console.log(user);
    const contacts = {
      name: user.name,
      email: user.email,
      phone: user.Addresses?.find((a) => a.isDefault)?.phone,
      country: user.Addresses?.find((a) => a.isDefault)?.country,
      city: user.Addresses?.find((a) => a.isDefault)?.city,
      joinDate: new Intl.DateTimeFormat("en-US").format(
        new Date(user.PersonalInfo?.createdAt),
      ),
      avatar: user.PersonalInfo?.avatar?.url,
    };
    const Addresses = user.Addresses;
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

exports.getPersonalInfo = async (req, res, next) => {
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

exports.uploadProfilePic = async (req, res, next) => {
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

exports.UpdatePersonalInfo = async (req, res, next) => {
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

exports.getUserPaginatedOrders = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId)
      .populate({
        path: "orders",
        select: "orderItems Status totalPrice createdAt",
      })
      .skip((page - 1) * limit)
      .limit(limit);
    if (!user) return res.sendStatus(401);
    const orders = user.orders;
    res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getUserWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId).populate({
      path: "wishlist",
      select: "title price images originalPrice category _id",
    });
    if (!user) return res.sendStatus(401);
    const wishlist = user.wishlist;
    res.status(200).json({ wishlist });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateUserWishlist = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const addedItems = req.body.arrOfIds;
    if (!addedItems || !Array.isArray(addedItems) || addedItems.length === 0)
      return res.status(400).json({ message: "addedItemsIds is required" });
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const productsCount = await Product.countDocuments({
      _id: { $in: addedItems },
    });
    if (productsCount !== addedItems.length)
      return res
        .status(404)
        .json({ message: "One or more products not found" });

    const wishlistSet = new Set(user.wishlist.map((id) => id.toString()));

    const toRemove = [];
    const toAdd = [];

    for (const addedId of addedItems) {
      if (!wishlistSet.has(addedId.toString())) {
        toAdd.push(addedId);
      } else {
        toRemove.push(addedId);
      }
    }

    if (toRemove.length > 0) {
      await User.updateOne(
        { _id: userId },
        { $pull: { wishlist: { $in: toRemove } } },
      );
      return res.status(200).json({
        message: "Product removed from wishlist",
        added: toAdd,
        removed: toRemove,
      });
    }
    if (toAdd.length > 0) {
      await User.updateOne(
        { _id: userId },
        { $addToSet: { wishlist: { $each: toAdd } } },
      );
      return res.status(200).json({
        message: "Product added to wishlist",
        added: toAdd,
        removed: toRemove,
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateUserAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(401);
    const { label, name, phone, email, street, city, state, country, zipCode } =
      req.body;
    const Id = req.params.id;
    if (Id) {
      // Update address
      const ownsAddress = (Id) =>
        user.Addresses.some((a) => a.toString() === Id);
      if (!ownsAddress(Id))
        return res.sendStatus(401).json({ message: "Unauthorized", ok: false });
      const updatedAddress = await Address.findByIdAndUpdate(Id, {
        label,
        name,
        phone,
        email,
        street,
        city,
        state,
        country,
        zipCode,
        user: userId,
      });
      if (!updatedAddress)
        return res
          .status(404)
          .json({ message: "Address not found", ok: false });
      res
        .status(200)
        .json({ message: "Address updated successfully", ok: true });
    } else {
      // Add new address
      const newAddress = await Address.create({
        label,
        name,
        phone,
        email,
        street,
        city,
        state,
        country,
        zipCode,
        user: userId,
      });
      user.Addresses.push(newAddress._id);
      await user.save();
      res.status(200).json({ message: "Address added successfully", ok: true });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteUserAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401);
    const user = await User.findById(userId);
    if (!user) return res.status(401);
    const Id = req.params.id;
    const ownsAddress = (Id) => user.Addresses.some((a) => a.toString() === Id);
    if (!ownsAddress(Id))
      return res.status(401).json({ message: "Unauthorized", ok: false });
    await Address.findByIdAndDelete(Id);
    user.Addresses.pull(Id);
    await user.save();
    res.status(200).json({ message: "Address deleted successfully", ok: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getUserAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId).populate("Addresses");
    if (!user) return res.sendStatus(401).json({ message: "User not found" });
    const addresses = user.Addresses;
    // console.log(addresses);
    res.status(200).json({ addresses });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.setAddressToDefault = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId).populate("Addresses");
    if (!user) return res.status(401).json({ message: "User not found" });
    const Id = req.params.id;
    const ownsAddress = (Id) =>
      user.Addresses.some((a) => a._id.toString() === Id);
    console.log(ownsAddress(Id), "trying to set default");
    if (!ownsAddress(Id))
      return res.status(401).json({ message: "Unauthorized" });
    await Address.updateMany(
      { _id: { $in: user.Addresses } },
      { $set: { isDefault: false } },
    );
    await Address.findByIdAndUpdate(Id, { $set: { isDefault: true } });
    const UpdatedAddress = await Address.findById(Id);
    if (!UpdatedAddress)
      return res.status(404).json({ message: "Address not found" });
    
    res
      .status(200)
      .json({ message: "Address set as default successfully", ok: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
