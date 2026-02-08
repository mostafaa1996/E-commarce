// import fetchProducts from "./getBaseProductsByRapidAPI/fetchProducts.js";
// import getDataByZenRows from "./getEnrichedProductsInfoByZenRowsAPI/getDataByZenRows.js";
// fetchProducts.run();
// getDataByZenRows.run();

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/Cart");
const checkoutRoutes = require("./routes/checkout");

const app = express();
app.use(express.json()); // for parsing application/json
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/shop", shopRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message , data: error.data});
});

mongoose
  .connect("mongodb+srv://mostafahamdy:2201996220Mos@cluster0.uqgen2r.mongodb.net/ShopLite?")
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
