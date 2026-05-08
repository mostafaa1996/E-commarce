const ActivityLog = require("../models/ActivityLog");
exports.getActivityLogs = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const logs = await ActivityLog.find().sort({ createdAt: -1 });
    res.json({
      message: "Activity logs fetched successfully",
      logs,
    });
  } catch (err) {
    next(err);
  }
};
