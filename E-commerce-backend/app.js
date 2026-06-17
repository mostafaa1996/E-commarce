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
const { startStockNotificationsTask }  = require ("./utils/stockNotificationsTask.js");

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
const adminOrdersRoute = require("./routes/adminOrders");
const adminCustomersRoute = require("./routes/adminCustomers");
const adminInventoryRoute = require("./routes/adminInventory");
const adminCouponsDiscountRoute = require("./routes/adminCouponsDiscount");
const adminReviewsRoute = require("./routes/adminReviews");
const adminAnaliticsRoute = require("./routes/adminAnalitics");
const adminActivityLogsRoute = require("./routes/ActivityLog");
const adminSettingsRoute = require("./routes/adminSettings");
const HomeRoute = require("./routes/Home");
const ContactsRoute = require("./routes/contacts");
const adminNotificationsRoute = require("./routes/adminNotifications");

const app = express();
const port = process.env.PORT || 3000;
const normalizeOrigin = (origin) => {
  if (!origin) return null;

  try {
    return new URL(origin.trim()).origin;
  } catch (error) {
    return origin.trim().replace(/\/$/, "");
  }
};

const allowedOrigins = [
  ...(process.env.CLIENT_URL || "").split(","),
  "http://localhost:5173",
]
  .map(normalizeOrigin)
  .filter(Boolean);

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is required");
  process.exit(1);
}

app.use("/api", stripeWebhookRoute);
app.use(express.json()); // for parsing application/json
app.use(cookieParser());

app.use(
  cors({
    origin(origin, callback) {
      const requestOrigin = normalizeOrigin(origin);

      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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
app.use("/admin/orders", adminOrdersRoute);
app.use("/admin/customers", adminCustomersRoute);
app.use("/admin/inventory", adminInventoryRoute);
app.use("/admin/coupons-discounts", adminCouponsDiscountRoute);
app.use("/admin/reviews", adminReviewsRoute);
app.use("/admin/analitics", adminAnaliticsRoute);
app.use("/admin/activity-logs", adminActivityLogsRoute);
app.use("/admin/settings", adminSettingsRoute);
app.use("/admin/notifications", adminNotificationsRoute);
app.use("/home", HomeRoute);
app.use("/contacts", ContactsRoute);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  res.status(status).json({ message: error.message, data: error.data });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port ${port}`);
      startStockNotificationsTask();
    });
  })
  .catch((err) => {
    console.log(err);
  });
