const User = require("../models/User");
const Product = require("../models/Product");
const Address = require("../models/Address");
const Order = require("../models/Order");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");
const { createOrder } = require("./order");
const mongoose = require("mongoose");
const { compare } = require("bcryptjs");

function formatOrderId(order) {
  const date = new Date(order.createdAt || order.date || Date.now())
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const suffix = String(order._id).slice(-6).toUpperCase();

  return `#ORD-${date}-${suffix}`;
}

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
        path: "Addresses",
        limit: 3,
      })
      .populate({
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
    const wishlistItems = (user.wishlist || []).slice(0, 3);
    const wishlistProductIds = wishlistItems.map((item) => item.productId);
    const wishlistProducts = await Product.find({
      _id: { $in: wishlistProductIds },
      isActive: true,
    })
      .select("_id title images mainImage variants sourceCategoryName")
      .lean();
    const wishlist = wishlistItems.map((item) => {
      const product = wishlistProducts.find(
        (p) => String(p._id) === String(item.productId),
      );
      const selectedVariant = product?.variants.find(
        (variant) => String(variant._id) === String(item.variantId),
      );

      return {
        productId: item.productId,
        variantId: item.variantId,
        title: product?.title,
        image: product?.images?.[0]?.url || product?.mainImage?.url,
        category: product?.sourceCategoryName,
        variant: selectedVariant,
        price: selectedVariant?.price,
        compareAtPrice: selectedVariant?.compareAtPrice,
      };
    });
    // const notifications = user.notifications;
    // const paymentMethods = user.paymentMethods;
    const StatsData = {
      totalOrders: user.orders?.length,
      totalWishlist: user.wishlist?.length,
      totalReviews: user.reviews?.length,
    };
    const matchStage = {
      userId: new mongoose.Types.ObjectId(userId),
    };
    const pipeline = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "products",
        },
      },
    ];
    const Orders = await Order.aggregate(pipeline, {
      $sort: { createdAt: -1 },
      $limit: 4,
      $project: {
        _id: 1,
        orderItems: {
          $map: {
            input: "$orderItems",
            as: "item",
            in: {
              $let: {
                vars: {
                  productData: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$products",
                          as: "product",
                          cond: {
                            $eq: ["$$product._id", "$$item.product"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  product: "$$item.product",
                  quantity: "$$item.quantity",
                  price: "$$item.price",
                  subtotal: "$$item.subtotal",
                  title: "$$productData.title",
                  image: {
                    $arrayElemAt: ["$$productData.images.url", 0],
                  },
                },
              },
            },
          },
        },
        status: 1,
        paymentMethod: 1,
        paymentStatus: 1,
        itemsPrice: 1,
        shippingPrice: 1,
        taxPrice: 1,
        totalPrice: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    });
    console.log(wishlist);
    res.status(200).json({
      contacts,
      Addresses,
      Orders,
      wishlist,
      StatsData: {
        ...StatsData,
        totalSpent: Orders?.reduce(
          (total, order) => total + order.totalPrice,
          0,
        ),
      },
      statusStyles: {
        pending: "bg-red-200 text-red-600",
        processing: "bg-red-200 text-red-600",
        failed: "bg-red-200 text-red-600",
        cancelled: "bg-red-100 text-red-600",
        orderPlaced: "bg-green-200 text-green-600",
        delivered: "bg-green-200 text-green-600",
        shipped: "bg-yellow-100 text-yellow-600",
        returned: "bg-blue-100 text-red-600",
      },
      paymentStatusStyles: {
        pending: "bg-red-200 text-red-600",
        paid: "bg-green-200 text-green-600",
        failed: "bg-red-200 text-red-600",
        cancelled: "bg-red-100 text-red-600",
        refunded: "bg-blue-100 text-red-600",
        not_required: "bg-yellow-100 text-yellow-600",
      },
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

exports.UpdatePersonalInfo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(401);
    const {
      firstName,
      lastName,
      email,
      phone,
      DateOfBirth,
      gender,
      location,
      Bio,
    } = req.body;

    const avatar = req.file;
    const result = await UploadToCloudinary(avatar.buffer, req.user.id);

    await User.findByIdAndUpdate(userId, {
      $set: {
        "PersonalInfo.firstName": firstName,
        "PersonalInfo.lastName": lastName,
        "PersonalInfo.email": email,
        "PersonalInfo.phone": phone,
        "PersonalInfo.dateOfBirth": DateOfBirth,
        "PersonalInfo.gender": gender,
        "PersonalInfo.location": location,
        "PersonalInfo.Bio": Bio,
        "PersonalInfo.avatar.url": result.secure_url,
        "PersonalInfo.avatar.publicId": result.public_id,
        "PersonalInfo.updatedAt": new Date(),
      },
    });
    await user.save();
    res.status(200).json({ message: "Personal info updated successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status;
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    const matchStage = {
      userId: new mongoose.Types.ObjectId(userId),
    };
    if (status && status !== "All") {
      matchStage.status = status;
    }
    const pipeline = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "products",
        },
      },
    ];
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { paymentStatus: { $regex: search, $options: "i" } },
            { paymentMethod: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
            { "products.title": { $regex: search, $options: "i" } },
          ],
        },
      });
    }
    const result = await Order.aggregate([
      ...pipeline,
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                orderItems: {
                  $map: {
                    input: "$orderItems",
                    as: "item",
                    in: {
                      $let: {
                        vars: {
                          productData: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$products",
                                  as: "product",
                                  cond: {
                                    $eq: ["$$product._id", "$$item.product"],
                                  },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        in: {
                          product: "$$item.product",
                          quantity: "$$item.quantity",
                          price: "$$item.price",
                          subtotal: "$$item.subtotal",
                          title: "$$productData.title",
                          image: {
                            $arrayElemAt: ["$$productData.images.url", 0],
                          },
                        },
                      },
                    },
                  },
                },
                status: 1,
                paymentMethod: 1,
                paymentStatus: 1,
                itemsPrice: 1,
                shippingPrice: 1,
                taxPrice: 1,
                totalPrice: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const orders = (result[0]?.data || []).map((order) => ({
      ...order,
      orderId: formatOrderId(order),
    }));
    const totalCount = result[0]?.totalCount[0]?.count || 0;
    res.status(200).json({
      orders,
      pagination: { totalCount, page, limit },
      statusEnum: Order.schema.path("status").enumValues,
      statusStyles: {
        pending: "bg-red-200 text-red-600",
        processing: "bg-red-200 text-red-600",
        failed: "bg-red-200 text-red-600",
        cancelled: "bg-red-100 text-red-600",
        orderPlaced: "bg-green-200 text-green-600",
        delivered: "bg-green-200 text-green-600",
        shipped: "bg-yellow-100 text-yellow-600",
        returned: "bg-blue-100 text-red-600",
      },
      paymentStatusStyles: {
        pending: "bg-red-200 text-red-600",
        paid: "bg-green-200 text-green-600",
        failed: "bg-red-200 text-red-600",
        cancelled: "bg-red-100 text-red-600",
        refunded: "bg-blue-100 text-red-600",
        not_required: "bg-yellow-100 text-yellow-600",
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getUserWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId).select("wishlist");
    if (!user)
      return res.status(401).json({ message: "User wishlist not found" });
    if (!user.wishlist || user.wishlist.length === 0)
      return res
        .status(200)
        .json({ wishedProducts: [], message: "User wishlist not found" });
    const productIds = user.wishlist.map((item) => item.productId);
    const wishlist = await Product.find({
      _id: { $in: productIds },
    }).select("_id title images mainImage variants sourceCategoryName");

    const wishedProducts = user.wishlist.map((item) => {
      const product = wishlist.find(
        (p) => String(p._id) === String(item.productId),
      );

      const selectedVariant = product?.variants.find(
        (variant) => String(variant._id) === String(item.variantId),
      );

      return {
        productId : item.productId,
        variantId : item.variantId,
        title: product?.title,
        image: product?.images?.[0]?.url || product?.mainImage?.url,
        category: product?.sourceCategoryName,
        variant: selectedVariant,
        price: selectedVariant?.price,
        compareAtPrice: selectedVariant?.compareAtPrice,
      };
    });
    res.status(200).json({ wishedProducts });
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
    const productIds = addedItems.map((item) => item.productId);
    const productsCount = await Product.countDocuments({
      _id: { $in: productIds },
    });
    if (productsCount !== addedItems.length)
      return res
        .status(404)
        .json({ message: "One or more products not found" });

    const wishlistSet = new Set(
      user.wishlist?.map(
        (item) => `${item.productId.toString()}:${item.variantId.toString()}`,
      ) || [],
    );

    const toRemove = [];
    const toAdd = [];

    for (const item of addedItems) {
      const wishlistKey = `${item.productId.toString()}:${item.variantId.toString()}`;
      const wishlistItem = {
        productId: item.productId,
        variantId: item.variantId,
      };
      if (!wishlistSet.has(wishlistKey)) {
        toAdd.push(wishlistItem);
      } else {
        toRemove.push(wishlistItem);
      }
    }

    if (toRemove.length > 0) {
      await User.updateOne(
        { _id: userId },
        {
          $pull: {
            wishlist: {
              $or: toRemove.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
              })),
            },
          },
        },
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

exports.clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(401).json({ message: "user not found" });
    await User.updateOne({ _id: userId }, { $set: { wishlist: [] } });
    res.status(200).json({ message: "Wishlist cleared successfully" });
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
