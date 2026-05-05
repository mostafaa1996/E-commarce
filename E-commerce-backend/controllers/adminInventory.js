const mongoose = require("mongoose");
const Product = require("../models/Product");

function normalizePositiveNumber(value, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

function formatDate(date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeInventoryStatus(stock, lowStockThreshold, criticalStockThreshold) {
  if (stock <= 0) {
    return "OUT_OF_STOCK";
  }

  if (stock <= criticalStockThreshold) {
    return "CRITICAL_STOCK";
  }

  if (stock <= lowStockThreshold) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}

exports.getAdminInventory = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const page = normalizePositiveNumber(req.query.page, 1);
    const limit = Math.min(normalizePositiveNumber(req.query.limit, 10), 100);
    const skip = (page - 1) * limit;

    const statusExpression = {
      $let: {
        vars: {
          stockValue: { $ifNull: ["$variants.stock", 0] },
          lowThreshold: { $ifNull: ["$variants.lowStockThreshold", 5] },
          criticalThreshold: {
            $ifNull: ["$variants.criticalStockThreshold", 2],
          },
        },
        in: {
          $switch: {
            branches: [
              {
                case: { $lte: ["$$stockValue", 0] },
                then: "Out Of Stock",
              },
              {
                case: {
                  $lte: ["$$stockValue", "$$criticalThreshold"],
                },
                then: "Critical",
              },
              {
                case: {
                  $and: [
                    { $lte: ["$$stockValue", "$$lowThreshold"] },
                    { $gt: ["$$stockValue", "$$criticalThreshold"] },
                  ],
                },
                then: "Low",
              },
            ],
            default: "In Stock",
          },
        },
      },
    };

    const basePipeline = [
      {
        $match: {
          variants: { $exists: true, $ne: [] },
          //variants.isActive: true
        },
      },
      { $unwind: "$variants" },
      {
        $project: {
          _id: 1,
          title: 1,
          category: "$sourceCategoryName",
          variantId: "$variants._id",
          sku: "$variants.sku",
          stock: { $ifNull: ["$variants.stock", 0] },
          lowStockThreshold: { $ifNull: ["$variants.lowStockThreshold", 5] },
          status: statusExpression,
          criticalStockThreshold: {
            $ifNull: ["$variants.criticalStockThreshold", 0],
          },
          updatedAt: { $ifNull: ["$variants.updatedAt", null] },
        },
      },
    ];

    const [inventoryRows, summary] = await Promise.all([
      Product.aggregate([
        ...basePipeline,
        { $sort: { _id: -1, variantId: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      Product.aggregate([
        ...basePipeline,
        {
          $group: {
            _id: null,
            productsCount: { $sum: 1 },
            InStockCount: {
              $sum: { $cond: [{ $eq: ["$status", "In Stock"] }, 1, 0] },
            },
            LowStockCount: {
              $sum: { $cond: [{ $eq: ["$status", "Low"] }, 1, 0] },
            },
            OutOfStockCount: {
              $sum: { $cond: [{ $eq: ["$status", "Out Of Stock"] }, 1, 0] },
            },
            CriticalStockCount: {
              $sum: { $cond: [{ $eq: ["$status", "Critical"] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const counts = summary[0] || {
      productsCount: 0,
      InStockCount: 0,
      LowStockCount: 0,
      OutOfStockCount: 0,
      CriticalStockCount: 0,
    };

    const totalPages = Math.max(1, Math.ceil(counts.productsCount / limit));

    return res.status(200).json({
      pagination: {
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      productsCount: counts.productsCount,
      InStockCount: counts.InStockCount,
      LowStockCount: counts.LowStockCount,
      OutOfStockCount: counts.OutOfStockCount,
      CriticalStockCount: counts.CriticalStockCount,
      Inventory: inventoryRows.map((item) => ({
        ...item,
        updatedAt: item?.updatedAt ? formatDate(item.updatedAt) : null,
      })),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const productId = req.params.id;
    const { variantId, intent } = req.body || {};
    const { stock, lowStockThreshold, criticalStockThreshold } = intent || {};

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    if (!mongoose.Types.ObjectId.isValid(variantId)) {
      return res.status(400).json({ message: "Invalid variant id." });
    }

    const updates = {};

    if (stock !== undefined && stock !== null) {
      const parsedStock = Number(stock);

      if (!Number.isFinite(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ message: "Invalid stock value." });
      }

      updates.stock = parsedStock;
    }

    if (lowStockThreshold !== undefined && lowStockThreshold !== null) {
      const parsedLowStockThreshold = Number(lowStockThreshold);

      if (!Number.isFinite(parsedLowStockThreshold) || parsedLowStockThreshold < 0) {
        return res.status(400).json({ message: "Invalid lowStockThreshold value." });
      }

      updates.lowStockThreshold = parsedLowStockThreshold;
    }

    if (criticalStockThreshold !== undefined && criticalStockThreshold !== null) {
      const parsedCriticalStockThreshold = Number(criticalStockThreshold);

      if (!Number.isFinite(parsedCriticalStockThreshold) || parsedCriticalStockThreshold < 0) {
        return res.status(400).json({ message: "Invalid criticalStockThreshold value." });
      }

      updates.criticalStockThreshold = parsedCriticalStockThreshold;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        message: "At least one of stock, lowStockThreshold, or criticalStockThreshold is required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({ message: "Variant not found." });
    }

    if (updates.stock !== undefined ) {
      variant.stock = updates.stock;
    }

    if (updates.lowStockThreshold !== undefined) {
      variant.lowStockThreshold = updates.lowStockThreshold;
    }

    if (updates.criticalStockThreshold !== undefined ) {
      variant.criticalStockThreshold = updates.criticalStockThreshold;
    }

    variant.availabilityStatus = normalizeInventoryStatus(
      variant.stock,
      variant.lowStockThreshold,
      variant.criticalStockThreshold,
    );
    variant.updatedAt = new Date();

    product.inventory.totalStock = (product.variants || []).reduce(
      (total, item) => total + (Number(item.stock) || 0),
      0,
    );
    product.updatedAt = new Date();

    await product.save();
    console.log("Inventory updated successfully");
    return res.status(200).json({
      message: "Inventory updated successfully",
      product: {
        _id: product._id,
        variantId: variant._id,
        stock: variant.stock,
        lowStockThreshold: variant.lowStockThreshold,
        criticalStockThreshold: variant.criticalStockThreshold,
        availabilityStatus: variant.availabilityStatus,
        updatedAt: formatDate(variant.updatedAt),
      },
    });
  } catch (err) {
    next(err);
  }
};
