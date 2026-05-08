const ActivityLog = require("../models/ActivityLog");

async function createActivityLog({
  type,
  title,
  message,
  actorRole = "Admin",
  createdAt = new Date(),
  ipAddress = ""
}) {
  try {
    await ActivityLog.create({
      type,
      title,
      message,
      actorRole,
      createdAt,
      ipAddress
    });
  } catch (error) {
    console.error("Failed to create activity log:", error.message);
  }
}

module.exports = createActivityLog;