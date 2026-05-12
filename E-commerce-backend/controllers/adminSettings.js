const Store = require("../models/storeInfo");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
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

exports.getAdminSettings = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const [adminUser, store] = await Promise.all([
      User.findOne({ role: "admin" })
        .select("name email phone PersonalInfo")
        .lean(),
      Store.findOne().lean(),
    ]);

    const profile = {
      firstName:
        adminUser?.PersonalInfo?.firstName ||
        adminUser?.name?.split(" ")?.[0] ,
      lastName:
        adminUser?.PersonalInfo?.lastName ||
        adminUser?.name?.split(" ")?.slice(1).join(" "),
      email:
        adminUser?.PersonalInfo?.email ||
        adminUser?.email ,
      phone:
        adminUser?.PersonalInfo?.phone ||
        adminUser?.phone ,
      image: adminUser?.PersonalInfo?.avatar?.url
    };

    const storeSettings = {
      storeName: store?.name,
      supportEmail: store?.email ,
      phone: store?.phone ,
      shippingFee: String(store?.shippingFee),
      address: store?.address,
    };

    return res.status(200).json({
      message: "Admin settings fetched successfully",
      settings: {
        profile,
        store: storeSettings,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAdminProfile = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const adminUser = await User.findById(req.user.id);

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(404).json({ message: "Admin not found." });
    }

    const firstName = req.body.firstName?.trim() || "";
    const lastName = req.body.lastName?.trim() || "";
    const email = req.body.email?.trim() || "";
    const phone = req.body.phone?.trim() || "";
    const fullName = `${firstName} ${lastName}`.trim();

    adminUser.name = fullName || adminUser.name;
    adminUser.email = email || adminUser.email;
    adminUser.phone = phone;
    adminUser.PersonalInfo = adminUser.PersonalInfo || {};
    adminUser.PersonalInfo.firstName = firstName;
    adminUser.PersonalInfo.lastName = lastName;
    adminUser.PersonalInfo.email = email || adminUser.email;
    adminUser.PersonalInfo.phone = phone;
    adminUser.PersonalInfo.updatedAt = new Date();

    if (req.file) {
      const result = await UploadToCloudinary(req.file.buffer, adminUser._id);
      adminUser.PersonalInfo.avatar = adminUser.PersonalInfo.avatar || {};
      adminUser.PersonalInfo.avatar = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    await adminUser.save();

    return res.status(200).json({
      message: "Admin profile updated successfully",
      profile: {
        firstName: adminUser.PersonalInfo?.firstName || firstName,
        lastName: adminUser.PersonalInfo?.lastName || lastName,
        email: adminUser.PersonalInfo?.email || adminUser.email,
        phone: adminUser.PersonalInfo?.phone || adminUser.phone,
        image: adminUser.PersonalInfo?.avatar?.url,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAdminPassword = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { currentPassword, newPassword , confirmPassword } = req.body;
    const adminUser = await User.findById(req.user.id);

    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found." });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match." });
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      adminUser.password
    );

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    adminUser.password = await bcrypt.hash(newPassword, 10);
    await adminUser.save();

    return res
      .status(200)
      .json({ message: "Admin password updated successfully." });
  } catch (err) {
    next(err);
  }
};

exports.updateAdminStore = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { storeName, supportEmail, phone, shippingFee, address } = req.body;

    let store = await Store.findOne();
    if (!store) {
      if (
        !storeName ||
        !supportEmail ||
        !phone ||
        shippingFee === undefined ||
        !address
      ) {
        return res.status(400).json({
          message:
            "storeName, supportEmail, phone, shippingFee, and address are required to create the store.",
        });
      }

      store = new Store({
        name: storeName,
        email: supportEmail,
        phone,
        shippingFee: Number(shippingFee),
        address,
        icon: "",
      });
    }

    if (storeName !== undefined) store.name = storeName;
    if (supportEmail !== undefined) store.email = supportEmail;
    if (phone !== undefined) store.phone = phone;
    if (shippingFee !== undefined) store.shippingFee = Number(shippingFee);
    if (address !== undefined) store.address = address;

    await store.save();

    return res.status(200).json({
      message: "Store settings updated successfully",
      store: {
        storeName: store.name,
        supportEmail: store.email,
        phone: store.phone,
        shippingFee: String(store.shippingFee),
        address: store.address,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTopBarInfo = async(req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    const topBarInfo = {
      firstName: admin.PersonalInfo?.firstName || admin.name?.split(" ")?.[0],
      lastName: admin.PersonalInfo?.lastName || admin.name?.split(" ")?.slice(1).join(" "),
      email: admin.PersonalInfo?.email || admin.email,
      avatar: admin.PersonalInfo?.avatar?.url
    }
    if (!topBarInfo) {
      return res.status(404).json({ message: "Top bar info not found." });
    }
    res.status(200).json({ message: "Top bar info fetched successfully", topBarInfo });
  } catch (err) {
    next(err);
  }
}