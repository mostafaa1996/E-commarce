const Notification = require("../models/Notification");
const User = require("../models/User");
const ADMIN_NOTIFICATION_TYPES = [
  { type: "NEW_ORDER", priority: "NORMAL" },
  { type: "PAYMENT_FAILED", priority: "URGENT" },
  { type: "PAYMENT_REFUNDED", priority: "NORMAL" },

  { type: "LOW_STOCK", priority: "HIGH" },
  { type: "CRITICAL_STOCK", priority: "URGENT" },
  { type: "OUT_OF_STOCK", priority: "URGENT" },

  { type: "NEW_REVIEW", priority: "NORMAL" },
  { type: "NEGATIVE_REVIEW", priority: "URGENT" },
  { type: "REVIEW_REQUIRES_APPROVAL", priority: "HIGH" },

  { type: "NEW_CONTACT_MESSAGE", priority: "HIGH" },
  { type: "RETURN_REQUEST", priority: "HIGH" },

  { type: "NEW_CUSTOMER_SIGNUP", priority: "LOW" },
];

async function createNotifications(notificationData) {
  try {
    //notification by default is for admin unless the userId of customer is provided
    if (!notificationData.userId) {
      const adminUser = await User.findOne({ role: "admin" });
      if (!adminUser) return;
      notificationData.userId = adminUser._id;
    }
    await Notification.create(notificationData);
  } catch (error) {
    console.error("Error creating notifications:", error);
    throw error;
  }
}

async function checkExistingNotifications(notificationData) {
  try {
    return await Notification.find({
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      priority: notificationData.priority,
      ...(notificationData.userId && { userId: notificationData.userId }),
      entityType: notificationData.entityType,
      entityId: notificationData.entityId,
      isRead: false,
      link: notificationData.link,
    });
  } catch (error) {
    console.error("Error checking existing notifications:", error);
    throw error;
  }
}

module.exports = { createNotifications, checkExistingNotifications };
