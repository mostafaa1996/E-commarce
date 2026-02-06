require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const User = require("../models/User");

exports.postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const existing = await User.findOne({ email });
    if (existing) {
      return res.send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    await user.save();
    res.status(201).send("User created");
  } catch (err) {
    console.log("error");
    next(err);
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("Email not found");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.send("Wrong password");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  console.log(user);

  await Token.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // old approach
  // res.status(200).json({
  //   accessToken,
  //   refreshToken,
  //   user: { id: user._id, email: user.email, role: user.role }
  // });

  // new approach
  res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      accessToken,
      user: { id: user._id, email: user.email, role: user.role },
    });
};

exports.logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const token = Token.findOneAndRemove({ token: refreshToken });
  if (!token) return res.sendStatus(401);
  res.sendStatus(204);
};

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const token = Token.findOne({ token: refreshToken });
  if (!token) return res.sendStatus(401);
  const Info = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (!Info) return res.sendStatus(401);
  
  const user  = await User.findById(Info.id);

  const accessToken = generateAccessToken(user);

  res.status(200).json({ accessToken });
  
};
