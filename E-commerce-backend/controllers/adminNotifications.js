const Notification = require("../models/Notification");
const formatRelativeTime = require("../utils/formatRelativeTime");

const typeColors = {
  order: "bg-info/10 text-info",
  stock: "bg-warning/10 text-warning",
  user: "bg-success/10 text-success",
  review: "bg-info/10 text-info",
};

exports.getAdminNotifications = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "user not found" });

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    const formattedNotifications = notifications.map((notification) => ({
      ...notification.toObject(),
      typeColor: typeColors[notification?.entityType?.toLowerCase()],
      relativeTime: formatRelativeTime(notification.createdAt),
    }));

    res.status(200).json(formattedNotifications);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateNotificationStatus = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "user not found" });

    const notificationId = req.params.id;
    if (!notificationId) return res.status(400).json({ message: "notification id is required" });

    const notification = await Notification.findOne({ userId, _id: notificationId });
    if (!notification) return res.status(404).json({ message: "notification not found" });

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "notification marked as read", notification });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateAllNotificationStatus = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "user not found" });

    await Notification.updateMany({ userId }, { isRead: true });

    res.status(200).json({ message: "all notifications marked as read" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
