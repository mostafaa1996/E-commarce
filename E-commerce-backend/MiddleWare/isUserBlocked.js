const User = require("../models/user");
exports.checkBlocked = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user?.status === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked by the admin.",
        blocked: true,
      });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
