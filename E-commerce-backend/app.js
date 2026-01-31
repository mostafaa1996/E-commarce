// import fetchProducts from "./getBaseProductsByRapidAPI/fetchProducts.js";
// import getDataByZenRows from "./getEnrichedProductsInfoByZenRowsAPI/getDataByZenRows.js";
// fetchProducts.run();
// getDataByZenRows.run();
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json()); // for parsing application/json

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/shop", shopRoutes);
app.use("/auth", authRoutes);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message , data: error.data});
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
