const Order = require("../models/Order");
const User = require("../models/User");

const REVENUE_ELIGIBLE_ORDER_STATUSES = [
  "orderPlaced",
  "shipped",
  "delivered",
];

const REVENUE_ELIGIBLE_PAYMENT_STATUSES = [
  "paid",
  "not_required",
];

function getAnalyticsStartDate(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth() - 11, 1);
}

function getNextMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function buildMonthlyBuckets(startDate, monthsCount = 12) {
  return Array.from({ length: monthsCount }, (_, index) => {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + index, 1);

    return {
      key: getMonthKey(date),
      month: getMonthLabel(date),
      year: date.getFullYear(),
      revenue: 0,
      ordersCount: 0,
      customerNumberJoined: 0,
      avgOrderValue: 0,
    };
  });
}

function roundNumber(value, digits = 2) {
  return Number(Number(value || 0).toFixed(digits));
}

exports.getAdminAnalitics = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const now = new Date();
    const startDate = getAnalyticsStartDate(now);
    const endDate = getNextMonth(now);
    const monthlyBuckets = buildMonthlyBuckets(startDate);
    const monthMap = new Map(monthlyBuckets.map((item) => [item.key, item]));

    const revenueMatch = {
      createdAt: { $gte: startDate, $lt: endDate },
      $or: [
        { status: { $in: REVENUE_ELIGIBLE_ORDER_STATUSES } },
        { paymentStatus: { $in: REVENUE_ELIGIBLE_PAYMENT_STATUSES } },
      ],
    };

    const [
      monthlyOrders,
      monthlyCustomers,
      topProducts,
      categorySales,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: revenueMatch,
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$totalPrice" },
            ordersCount: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),
      User.aggregate([
        {
          $match: {
            role: "customer",
            "PersonalInfo.createdAt": { $gte: startDate, $lt: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$PersonalInfo.createdAt" },
              month: { $month: "$PersonalInfo.createdAt" },
            },
            customerNumberJoined: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: revenueMatch,
        },
        {
          $unwind: "$orderItems",
        },
        {
          $group: {
            _id: "$orderItems.product",
            count: { $sum: "$orderItems.quantity" },
            revenue: { $sum: "$orderItems.subtotal" },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 10,
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productData",
          },
        },
        {
          $unwind: {
            path: "$productData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            productTitle: {
              $ifNull: ["$productData.title", "Deleted Product"],
            },
            count: 1,
            revenue: { $round: ["$revenue", 2] },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: revenueMatch,
        },
        {
          $unwind: "$orderItems",
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.product",
            foreignField: "_id",
            as: "productData",
          },
        },
        {
          $unwind: {
            path: "$productData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              $ifNull: ["$productData.sourceCategoryName", "Uncategorized"],
            },
            soldCount: { $sum: "$orderItems.quantity" },
          },
        },
        {
          $sort: {
            soldCount: -1,
          },
        },
      ]),
    ]);

    monthlyOrders.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      const monthBucket = monthMap.get(key);

      if (!monthBucket) {
        return;
      }

      monthBucket.revenue = roundNumber(item.revenue);
      monthBucket.ordersCount = item.ordersCount;
      monthBucket.avgOrderValue = item.ordersCount
        ? roundNumber(item.revenue / item.ordersCount)
        : 0;
    });

    monthlyCustomers.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      const monthBucket = monthMap.get(key);

      if (!monthBucket) {
        return;
      }

      monthBucket.customerNumberJoined = item.customerNumberJoined;
    });

    const totalSoldProducts = categorySales.reduce(
      (sum, item) => sum + (Number(item.soldCount) || 0),
      0,
    );

    return res.status(200).json({
      message: "Admin analytics fetched successfully",
      analytics: {
        monthlyRevenue: monthlyBuckets,
        topProducts: topProducts.map((item) => ({
          productTitle: item.productTitle,
          count: item.count,
          revenue: item.revenue,
        })),
        categoryData: categorySales.map((item) => ({
          categoryName: item._id,
          percentage: totalSoldProducts
            ? roundNumber((item.soldCount / totalSoldProducts) * 100, 1)
            : 0,
        })),
        HighestInTopProducts: Math.max(...topProducts.map((item) => item.revenue)),
        meta: {
          startDate,
          endDate,
          generatedAt: now,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
