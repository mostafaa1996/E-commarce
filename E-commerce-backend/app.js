// import fetchProducts from "./getBaseProductsByRapidAPI/fetchProducts.js";
// import getDataByZenRows from "./getEnrichedProductsInfoByZenRowsAPI/getDataByZenRows.js";
// fetchProducts.run();
// getDataByZenRows.run();

require("dotenv").config();
require("./utils/exchangeRateRequest");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/Cart");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/order");
const userProfileRoutes = require("./routes/UserProfile");
const userProfilePaymentsRoutes = require("./routes/UserProfilePayments");
const UserProfileSettingsRoutes = require("./routes/UserProfileSettings");
const exchangeRateRoutes = require("./routes/exchangeRate");
const stripeWebhookRoute = require("./routes/stripeWebhookRoute");
const adminDashboardRoute = require("./routes/adminDashboard");
const adminProductsRoute = require("./routes/adminProducts");
const adminCategoriesRoute = require("./routes/adminCategories");

const app = express();
app.use("/api", stripeWebhookRoute);
app.use(express.json()); // for parsing application/json
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/shop/products", shopRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/order", orderRoutes);
app.use(
  "/user/profile",
  userProfileRoutes,
  userProfilePaymentsRoutes,
  UserProfileSettingsRoutes,
);
app.use("/exchangeRate", exchangeRateRoutes);
app.use("/admin/dashboard", adminDashboardRoute );
app.use("/admin/products", adminProductsRoute);
app.use("/admin/categories", adminCategoriesRoute);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  res.status(status).json({ message: error.message, data: error.data });
});

mongoose
  .connect(
    "mongodb+srv://mostafahamdy:2201996220Mos@shoplite.ojxtkdz.mongodb.net/shoplite?",
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
