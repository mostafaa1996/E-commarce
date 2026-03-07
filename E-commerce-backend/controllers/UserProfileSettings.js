const bcrypt = require("bcryptjs");
const User = require("../models/User");
exports.changeUserPassword = async (req, res , next) => {
    try {
      const userId = req.user.id;
      if (!userId) return res.status(401);
      const user = await User.findById(userId);
      if (!user) return res.status(401);
      const { currentPassword, newPassword } = req.body;
      const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatch) return res.status(400).json({ message: "Old password is incorrect" });
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
      res.status(200).json({ message: "Password changed successfully" , ok : true });
    } catch (err) {
      console.log(err);
      next(err);
    }
};