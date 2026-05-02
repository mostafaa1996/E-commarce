const mongoose = require("mongoose");
const User = require("../models/User");

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePositiveNumber(value, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

const formateDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

exports.getAdminCustomers = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const page = normalizePositiveNumber(req.query.page, 1);
    const limit = Math.min(normalizePositiveNumber(req.query.limit, 10), 100);
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all")
      .trim()
      .toLowerCase();
    const spent = String(req.query.spent || "").trim().toLowerCase();

    const matchStage = {
      role: "customer",
    };

    if (status && status !== "all") {
      matchStage.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      matchStage.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }
    let sortStage = { "PersonalInfo.createdAt": -1, _id: -1 };

    if (spent === "low to high") {
      sortStage = { totalSpent: 1, "PersonalInfo.createdAt": -1, _id: -1 };
    } else if (spent === "high to low") {
      sortStage = { totalSpent: -1, "PersonalInfo.createdAt": -1, _id: -1 };
    }

    const totalCustomers = await User.countDocuments(matchStage);
    const customers = await User.find(matchStage)
      .select("name email phone totalOrders totalSpent status PersonalInfo.createdAt")
      .sort(sortStage)
      .skip(skip)
      .limit(limit)
      .lean();
    const totalPages = Math.max(1, Math.ceil(totalCustomers / limit));

    return res.status(200).json({
      message: "Admin customers fetched successfully",
      customers: customers.map((customer) => ({
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0,
        date: customer?.PersonalInfo?.createdAt
          ? formateDate(customer.PersonalInfo.createdAt)
          : null,
        status: customer.status,
      })),
      pagination: {
        page,
        limit,
        totalCustomers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      statusOptions: User.schema.path("status").enumValues,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAdminCustomerDetails = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid customer id." });
    }

    const customer = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
          role: "customer",
        },
      },
      {
        $lookup: {
          from: "addresses",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user", "$$userId"] },
              },
            },
            { $sort: { isDefault: -1, _id: 1 } },
            { $limit: 1 },
          ],
          as: "defaultAddress",
        },
      },
      {
        $lookup: {
          from: "orders",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                },
              },
            },
            { $sort: { createdAt: -1, _id: -1 } },
            {
              $project: {
                _id: 1,
                orderItems: 1,
                Status: "$status",
                status: 1,
                totalPrice: 1,
                createdAt: 1,
              },
            },
          ],
          as: "recentOrders",
        },
      },
      {
        $addFields: {
          defaultAddress: { $arrayElemAt: ["$defaultAddress", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: {
            $ifNull: ["$phone", "$defaultAddress.phone"],
          },
          defaultAddress: {
            $ifNull: ["$defaultAddress", "$PersonalInfo.location"],
          },
          recentOrders: 1,
          status: 1,
          createdAt: 1,
          totalOrders: 1,
          totalSpent: 1,
        },
      },
    ]);

    if (!customer.length) {
      return res.status(404).json({ message: "Customer not found." });
    }

    return res.status(200).json({
      message: "Admin customer details fetched successfully",
      customer: {
        ...customer[0],
        recentOrders: (customer[0].recentOrders || []).map((order) => ({
          ...order,
          createdAt: order?.createdAt ? formateDate(order.createdAt) : null,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAdminCustomerStatus = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    console.log(req.body);
    const { status } = req.body;
    const validStatuses = User.schema.path("status").enumValues;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid customer status.",
        statusOptions: validStatuses,
      });
    }

    const customer = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    return res.status(200).json({
      message: "Customer status updated successfully.",
      customer,
    });
  } catch (err) {
    next(err);
  }
};
