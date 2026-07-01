const User = require("../models/User");
module.exports = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "user not found" });
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
