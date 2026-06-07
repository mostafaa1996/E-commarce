const Product = require("../models/Product");
const User = require("../models/User");
const {
  createNotifications,
  checkExistingNotifications,
} = require("./createNotifications");

const STOCK_NOTIFICATION_INTERVAL = 10 * 60 * 1000;

let stockNotificationsTimer;

const getStockNotificationData = (product) => {
  const stock = product.stock;
  const productName = product.title;

  if (stock <= 0) {
    return {
      type: "OUT_OF_STOCK",
      title: "Product out of stock",
      message: `${productName} is now out of stock.`,
      priority: "URGENT",
    };
  }

  if (stock <= product.criticalStockThreshold) {
    return {
      type: "CRITICAL_STOCK",
      title: "Critical stock level",
      message: `${productName} has only ${stock} item(s) left.`,
      priority: "URGENT",
    };
  }

  if (stock <= product.lowStockThreshold) {
    return {
      type: "LOW_STOCK",
      title: "Low stock level",
      message: `${productName} has only ${stock} item(s) left.`,
      priority: "HIGH",
    };
  }

  return null;
};

const checkStockNotifications = async () => {
  const startedAt = new Date();
  let createdCount = 0;
  let duplicateCount = 0;
  let healthyStockCount = 0;

  const products = await Product.find({}).select("_id title variants");
  const admins = await User.find({ role: "admin", status: "active" }).select("_id");

  if (!admins.length) {
    console.log(`[stock-notifications] ${startedAt.toISOString()} skipped: no active admins`);
    return;
  }

  const variantProducts = products.flatMap((product) =>
    product.variants.map((variant) => ({
      productId: product._id,
      title: product.title,
      variantId: variant._id,
      stock: variant.stock,
      lowStockThreshold: variant.lowStockThreshold,
      criticalStockThreshold: variant.criticalStockThreshold,
      availabilityStatus: variant.availabilityStatus,
    })),
  );

  await Promise.all(
    variantProducts.map(async (product) => {
      const notificationData = getStockNotificationData(product);

      if (!notificationData) {
        healthyStockCount += 1;
        return;
      }

      await Promise.all(
        admins.map(async (admin) => {
          const notification = {
            ...notificationData,
            userId: admin._id,
            isRead: false,
            entityType: "PRODUCT",
            entityId: product.variantId,
            link: `/profile/admin/products/${product.productId}`,
          };

          const existingNotifications = await checkExistingNotifications(notification);

          if (existingNotifications.length) {
            duplicateCount += 1;
            return;
          }

          await createNotifications(notification);
          createdCount += 1;
        }),
      );
    }),
  );

  console.log(
    `[stock-notifications] ${startedAt.toISOString()} checked ${variantProducts.length} variants for ${admins.length} admins. Created: ${createdCount}, duplicates: ${duplicateCount}, healthy: ${healthyStockCount}`,
  );
};

exports.startStockNotificationsTask = () => {
  if (stockNotificationsTimer) return stockNotificationsTimer;

  console.log(
    `[stock-notifications] started. Running every ${STOCK_NOTIFICATION_INTERVAL / 1000 / 60} minutes`,
  );

  checkStockNotifications().catch((error) => {
    console.error("Error checking stock notifications:", error);
  });

  stockNotificationsTimer = setInterval(() => {
    checkStockNotifications().catch((error) => {
      console.error("Error checking stock notifications:", error);
    });
  }, STOCK_NOTIFICATION_INTERVAL);

  if (typeof stockNotificationsTimer.unref === "function") {
    stockNotificationsTimer.unref();
  }

  return stockNotificationsTimer;
};
