const mongoose = require("mongoose");
const Order = require("../models/Order");

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

function formatOrderId(order) {
  const date = new Date(order.createdAt || order.date || Date.now())
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const suffix = String(order._id).slice(-6).toUpperCase();

  return `#ORD-${date}-${suffix}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

exports.getAdminOrders = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const page = normalizePositiveNumber(req.query.page, 1);
    const limit = Math.min(normalizePositiveNumber(req.query.limit, 10), 100);
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all").trim();
    const paymentStatus = String(req.query.paymentStatus || "all").trim();

    const matchStage = {};

    if (status && status.toLowerCase() !== "all") {
      matchStage.status = new RegExp(`^${escapeRegex(status)}$`, "i");
    }

    if (paymentStatus && paymentStatus.toLowerCase() !== "all") {
      matchStage.paymentStatus = new RegExp(
        `^${escapeRegex(paymentStatus)}$`,
        "i",
      );
    }

    const searchRegex = search ? new RegExp(escapeRegex(search), "i") : null;
    const searchConditions = [];

    if (mongoose.Types.ObjectId.isValid(search)) {
      searchConditions.push({ _id: new mongoose.Types.ObjectId(search) });
    }

    if (searchRegex) {
      searchConditions.push(
        { "user.name": searchRegex },
        { "user.email": searchRegex },
        { paymentMethod: searchRegex },
        { status: searchRegex },
        { paymentStatus: searchRegex },
      );
    }

    const aggregation = await Order.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...(searchConditions.length
        ? [
            {
              $match: {
                $or: searchConditions,
              },
            },
          ]
        : []),
      {
        $facet: {
          orders: [
            { $sort: { createdAt: -1, _id: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "products",
                localField: "orderItems.product",
                foreignField: "_id",
                as: "products",
              },
            },
            {
              $project: {
                _id: 1,
                orderItems: 1,
                status: 1,
                paymentStatus: 1,
                createdAt: 1,
                shippingAddress: 1,
                paymentMethod: 1,
                shippingPrice: 1,
                totalPrice: 1,
                "user.name": 1,
                "user.email": 1,
                products: {
                  _id: 1,
                  title: 1,
                  mainImage: 1,
                  images: 1,
                },
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const orders = aggregation?.[0]?.orders || [];
    const totalOrders = aggregation?.[0]?.totalCount?.[0]?.count || 0;
    const totalPages = Math.max(1, Math.ceil(totalOrders / limit));

    const formattedOrders = orders.map((order) => {
      const productMap = new Map(
        (order.products || []).map((product) => [String(product._id), product]),
      );

      return {
        id: order._id,
        orderId: formatOrderId(order),
        orderItems: (order.orderItems || []).map((item) => {
          const product = productMap.get(String(item.product));

          return {
            image: product?.mainImage?.url || product?.images?.[0]?.url || null,
            price: item.price,
            quantity: item.quantity,
            title: product?.title || "",
            subtotal: item.subtotal,
          };
        }),
        status: order.status,
        customer: order.user?.name || "",
        email: order.user?.email || "",
        paymentStatus: order.paymentStatus,
        date: formatDate(order.createdAt),
        shippingAddress: `
          (${order.shippingAddress?.address || ""}) -
          (${order.shippingAddress?.city || ""}) -
          (${order.shippingAddress?.country || ""})`,
        paymentMethod: order.paymentMethod,
        shippingPrice: order.shippingPrice,
        totalPrice: order.totalPrice,
      };
    });
    console.log(page, limit, totalOrders, totalPages);
    return res.status(200).json({
      message: "Admin orders fetched successfully",
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      statusOptions: Order.schema.path("status").enumValues,
      paymentStatusOptions: Order.schema.path("paymentStatus").enumValues,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { status } = req.body;
    const validStatuses = Order.schema.path("status").enumValues;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
        statusOptions: validStatuses,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (err) {
    next(err);
  }
};
