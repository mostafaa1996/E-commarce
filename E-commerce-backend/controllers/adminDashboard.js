const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const REVENUE_ELIGIBLE_STATUSES = ["paid", "orderPlaced"];

const ORDER_STATUS_LABELS = {
  pending: "pending",
  processing: "processing",
  failed: "failed",
  cancelled: "cancelled",
  orderPlaced: "orderPlaced",
  delivered: "delivered",
  shipped: "shipped",
  returned: "returned",
};

const PAYMENT_STATUS_LABELS = {
  pending: "pending",
  succeeded: "paid",
  failed: "failed",
  cancelled: "refunded",
  not_required: "not_required",
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

function getPreviousMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const end = new Date(date.getFullYear(), date.getMonth(), 1);
  return { start, end };
}

function getPercentageChange(currentValue, previousValue) {
  if (!previousValue) {
    return currentValue ? 100 : 0;
  }

  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
}

function objectIdFromDate(date) {
  return new mongoose.Types.ObjectId(
    Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000",
  );
}

function getOrderDisplayId(order) {
  return `#ORD-${String(order.createdAt.getFullYear())}-${String(order._id).slice(-6).toUpperCase()}`;
}

function getCustomerName(user) {
  if (!user) return "Deleted User";

  const firstName = user.PersonalInfo?.firstName?.trim();
  const lastName = user.PersonalInfo?.lastName?.trim();
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();

  return fullName || user.name || "Unknown Customer";
}

function getDefaultProductPrice(product) {
  return product?.pricing?.minPrice || product?.price || 0;
}

function buildLowStockAlerts(products) {
  return products
    .map((product) => {
      const activeVariants = (product.variants || []).filter(
        (variant) => variant.isActive !== false,
      );

      if (!activeVariants.length || activeVariants.length < 2) {
        const fallbackStock = product.inventory?.totalStock;
        if (typeof fallbackStock !== "number" || fallbackStock > 5) {
          return null;
        }

        return {
          id: String(product._id),
          sku : product.variants[0].sku,
          name: product.title,
          stock: fallbackStock,
          status: fallbackStock <= 2 ? "Critical" : "Low",
          threshold: product.variants[0].lowStockThreshold || 5,
        };
      }

      const lowestVariant = activeVariants.reduce((lowest, current) => {
        if (!lowest || current.stock < lowest.stock) {
          return current;
        }
        return lowest;
      }, null);

      if (!lowestVariant || lowestVariant.stock > lowestVariant.lowStockThreshold) {
        return null;
      }

      const criticalThreshold = Math.max(2, Math.floor(lowestVariant.lowStockThreshold / 2));

      return {
        id: String(product._id),
        name: product.title,
        sku : lowestVariant.sku,
        stock: lowestVariant.stock,
        status: lowestVariant.stock <= criticalThreshold ? "Critical" : "Low",
        threshold: lowestVariant.lowStockThreshold,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.stock - b.stock);
}

exports.getAdminDashboard = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear + 1, 0, 1);
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - 7);

    const { start: currentMonthStart, end: currentMonthEnd } = getMonthRange(now);
    const { start: previousMonthStart, end: previousMonthEnd } = getPreviousMonthRange(now);
    const currentMonthUserIdRange = {
      $gte: objectIdFromDate(currentMonthStart),
      $lt: objectIdFromDate(currentMonthEnd),
    };
    const previousMonthUserIdRange = {
      $gte: objectIdFromDate(previousMonthStart),
      $lt: objectIdFromDate(previousMonthEnd),
    };

    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      newProductsThisWeek,
      currentMonthOrders,
      previousMonthOrders,
      currentMonthCustomers,
      previousMonthCustomers,
      revenueOrders,
      recentOrdersDocs,
      topProductsDocs,
      lowStockProductsDocs,
      statusCounts,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Product.countDocuments(),
      Product.countDocuments({ createdAt: { $gte: thisWeekStart } }),
      Order.countDocuments({
        createdAt: { $gte: currentMonthStart, $lt: currentMonthEnd },
      }),
      Order.countDocuments({
        createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd },
      }),
      User.countDocuments({
        role: "customer",
        _id: currentMonthUserIdRange,
      }),
      User.countDocuments({
        role: "customer",
        _id: previousMonthUserIdRange,
      }),
      Order.find({
        status: { $in: REVENUE_ELIGIBLE_STATUSES },
        createdAt: { $gte: yearStart, $lt: yearEnd },
      }).select("totalPrice createdAt"),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name email PersonalInfo.firstName PersonalInfo.lastName")
        .select("totalPrice status paymentStatus createdAt userId"),
      Product.find({ isActive: true })
        .sort({ soldCount: -1, createdAt: -1 })
        .limit(5)
        .select("title soldCount price pricing"),
      Product.find({ isActive: true }).select("title inventory variants"),
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const monthlyRevenueMap = new Map(
      monthNames.map((month) => [month, 0]),
    );

    let totalRevenue = 0;
    let currentMonthRevenue = 0;
    let previousMonthRevenue = 0;

    revenueOrders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      const orderRevenue = order.totalPrice || 0;
      const monthName = monthNames[createdAt.getMonth()];

      monthlyRevenueMap.set(monthName, (monthlyRevenueMap.get(monthName) || 0) + orderRevenue);
      totalRevenue += orderRevenue;

      if (createdAt >= currentMonthStart && createdAt < currentMonthEnd) {
        currentMonthRevenue += orderRevenue;
      }

      if (createdAt >= previousMonthStart && createdAt < previousMonthEnd) {
        previousMonthRevenue += orderRevenue;
      }
    });

    const statusCountMap = {
      pending: 0,
      processing: 0,
      failed: 0,
      cancelled: 0,
      orderPlaced: 0,
      delivered: 0,
      shipped: 0,
      returned: 0,
    };

    statusCounts.forEach((item) => {
      statusCountMap[item._id] = item.count;
    });

    const dashboardData = {
      overview: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        revenueChangePercentage: getPercentageChange(currentMonthRevenue, previousMonthRevenue),
        totalOrders,
        ordersChangePercentage: getPercentageChange(currentMonthOrders, previousMonthOrders),
        totalCustomers,
        customersChangePercentage: getPercentageChange(currentMonthCustomers, previousMonthCustomers),
        totalProducts,
        newProductsThisWeek,
      },
      orderStatusSummary: {
        pending: statusCountMap.pending,
        processing: statusCountMap.processing,
        failed: statusCountMap.failed,
        cancelled: statusCountMap.cancelled,
        shipped: statusCountMap.shipped,
        delivered: statusCountMap.delivered,
        orderPlaced: statusCountMap.orderPlaced,
        returned: statusCountMap.returned,
        paid: statusCountMap.orderPlaced + statusCountMap.shipped + statusCountMap.delivered,
        raw: statusCountMap,
      },
      revenueOverview: monthNames.map((month) => ({
        month,
        revenue: Number((monthlyRevenueMap.get(month) || 0).toFixed(2)),
      })),
      recentOrders: recentOrdersDocs.map((order) => ({
        id: String(order._id),
        orderNumber: getOrderDisplayId(order),
        customer: getCustomerName(order.userId),
        email: order.userId?.email || "No email",
        total: Number((order.totalPrice || 0).toFixed(2)),
        payment: PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus,
        status: ORDER_STATUS_LABELS[order.status] || order.status,
        createdAt: order.createdAt,
      })),
      topSellingProducts: topProductsDocs.map((product, index) => {
        const sold = product.soldCount || 0;
        const unitPrice = getDefaultProductPrice(product);

        return {
          id: String(product._id),
          rank: index + 1,
          name: product.title,
          sold,
          revenue: Number((sold * unitPrice).toFixed(2)),
        };
      }),
      lowStockAlerts: buildLowStockAlerts(lowStockProductsDocs),
      meta: {
        currency: "USD",
        generatedAt: new Date(),
        year: currentYear,
        supportedOrderStatuses: Object.keys(ORDER_STATUS_LABELS),
      },
    };

    return res.status(200).json({
      message: "Admin dashboard data fetched successfully",
      dashboard: dashboardData,
    });
  } catch (err) {
    next(err);
  }
};
