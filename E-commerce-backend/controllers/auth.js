const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.postSignup = async (req, res) => {
  const { name, email, password , confirmPassword } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 12);

  if (hashedPassword !== hashedConfirmPassword) {
    return res.send("Passwords do not match");
  }

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: "customer",
  });

  await user.save();
  res.redirect("/login");
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.send("Email not found");
  
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.send("Wrong password");
  
    req.session.user = user;
    req.session.isLoggedIn = true;
    req.session.role = user.role;
  
    return req.session.save(() => {
      res.redirect("/");
    });
  };

exports.logout = (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  };
  
