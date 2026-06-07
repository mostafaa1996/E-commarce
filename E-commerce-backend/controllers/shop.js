const Product = require("../models/Product");
const categories = require("../getBaseProductsByRapidAPI/categories");
const Review = require("../models/Review");
const User = require("../models/User");
const {createNotifications} = require("../utils/createNotifications");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createReviewNotification = async (userName, rating, isUpdated) => {
  try {
    if (!userName) {
      if (rating < 3) {
        await createNotifications({
          type: "NEGATIVE_REVIEW",
          title: "Negative review",
          message:
            "Non-registered user review has been submitted with negative rating and is waiting for approval",
          priority: "URGENT",
          isRead: false,
          entityType: "REVIEW",
          entityId: newReview._id,
          link: `/profile/admin/reviews/${newReview._id}`,
        });
      }
      await createNotifications({
        type: "REVIEW_REQUIRES_APPROVAL",
        title: "Review requires approval",
        message:
          "Non-registered user review has been submitted and is waiting for approval",
        priority: "HIGH",
        isRead: false,
        entityType: "REVIEW",
        entityId: newReview._id,
        link: `/profile/admin/reviews/${newReview._id}`,
      });
      return;
    }
    if (rating < 3) {
      await createNotifications({
        type: "NEGATIVE_REVIEW",
        title: "Negative review",
        message: `customer review has been submitted with negative rating from ${userName} and is waiting for approval`,
        priority: "URGENT",
        isRead: false,
        entityType: "REVIEW",
        entityId: newReview._id,
        link: `/profile/admin/reviews/${newReview._id}`,
      });
    } else {
      if (isUpdated) {
        await createNotifications({
          type: "NEW_REVIEW",
          title: "New review",
          message: `customer review has been updated from ${userName} and is waiting for approval`,
          priority: "NORMAL",
          isRead: false,
          entityType: "REVIEW",
          entityId: newReview._id,
          link: `/profile/admin/reviews/${newReview._id}`,
        });
      }
      await createNotifications({
        type: "NEW_REVIEW",
        title: "New review",
        message: `customer review has been submitted from ${userName} and is waiting for approval`,
        priority: "NORMAL",
        isRead: false,
        entityType: "REVIEW",
        entityId: newReview._id,
        link: `/profile/admin/reviews/${newReview._id}`,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const isEnabled = (value) =>
  value === true ||
  value === "true" ||
  value === "1" ||
  value === "yes" ||
  value === "on";
//
//  API = /shop/products?
//   page=...&
//   limit=...&
//   category=...&
//   brand=...&
//   minPrice=...&
//   maxPrice=...&
//   sort=...&
//   tags=....

exports.getProducts = async (req, res, next) => {
  const {
    page = 1,
    limit = 9,
    category,
    brands,
    minPrice,
    maxPrice,
    sort,
    tags,
    onDeal,
    topRated,
    bestSeller,
    search,
  } = req.query;
  console.log(req.query);
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const api_params = {};
  let sortOptions = {};

  if (category && category !== "null" && category !== "") {
    api_params.sourceCategoryName = { $regex: category, $options: "i" };
  }
  if (brands && Array.isArray(brands) && brands.length > 0) {
    api_params.brand = { $in: brands.map((brand) => new RegExp(brand, "i")) };
  }
  if (brands && !Array.isArray(brands)) {
    api_params.brand = { $regex: brands, $options: "i" };
  }
  if (
    minPrice &&
    minPrice !== "null" &&
    minPrice !== "" &&
    maxPrice &&
    maxPrice !== "null" &&
    maxPrice !== "" &&
    maxPrice !== "0"
  ) {
    api_params.price = {};
    api_params.price.$gte = Number(minPrice);
    api_params.price.$lte = Number(maxPrice);
  }
  if (tags && Array.isArray(tags) && tags.length > 0) {
    api_params.tags = { $in: tags.map((tag) => new RegExp(tag, "i")) };
  }
  if (tags && !Array.isArray(tags)) {
    api_params.tags = { $regex: tags, $options: "i" };
  }
  if (search && search !== "null" && String(search).trim() !== "") {
    const searchRegex = new RegExp(escapeRegex(String(search).trim()), "i");
    api_params.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { sourceCategoryName: searchRegex },
      { brand: searchRegex },
      { tags: searchRegex },
    ];
  }
  if (isEnabled(onDeal)) {
    const now = new Date();
    const oneMonthFromNow = new Date(now);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    api_params.$expr = {
      $gt: [
        {
          $size: {
            $filter: {
              input: { $ifNull: ["$variants", []] },
              as: "variant",
              cond: {
                $and: [
                  { $eq: ["$$variant.isActive", true] },
                  { $gt: ["$$variant.compareAtPrice", 0] },
                  { $lt: ["$$variant.price", "$$variant.compareAtPrice"] },
                  { $gte: ["$$variant.expireDate", now] },
                  { $lte: ["$$variant.expireDate", oneMonthFromNow] },
                ],
              },
            },
          },
        },
        0,
      ],
    };
  }
  if (isEnabled(topRated)) {
    api_params["reviewSummary.averageRating"] = { $gt: 0 };
  }
  if (isEnabled(bestSeller)) {
    api_params.soldCount = { $gt: 0 };
  }
  if (sort && sort !== "null" && sort !== "") {
    if (sort === "price-asc") sortOptions.price = 1;
    if (sort === "price-desc") sortOptions.price = -1;
    if (sort === "newest" || sort === "default") sortOptions.createdAt = -1;
    if (sort === "oldest") sortOptions.createdAt = 1;
    if (sort === "rating") sortOptions["reviewSummary.averageRating"] = -1;
    if (sort === "Alphabetical") sortOptions.title = 1;
    if (sort === "ReverseAlphabetical") sortOptions.title = -1;
  }
  if (isEnabled(bestSeller)) {
    sortOptions.soldCount = -1;
    sortOptions.createdAt = -1;
  }
  if (isEnabled(topRated)) {
    sortOptions["reviewSummary.reviewsCount"] = -1;
    sortOptions["reviewSummary.averageRating"] = -1;
    sortOptions.createdAt = -1;
  } else {
    sortOptions.createdAt = -1;
  }
  console.log(api_params);
  console.log(sortOptions);
  try {
    const productFilter = {
      ...api_params,
      isActive: true,
    };
    const products = await Product.find({
      ...productFilter,
    })
      .select(
        "_id title price mainImage images reviewSummary sourceCategoryName",
      )
      .lean()
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    const totalItems = await Product.countDocuments(productFilter);
    if (category && category !== "null" && category !== "") {
      const Brands = await Product.find({
        sourceCategoryName: { $regex: req.query.category || "", $options: "i" },
      }).distinct("brand");
      const Tags = await Product.find({
        sourceCategoryName: { $regex: req.query.category || "", $options: "i" },
      }).distinct("tags");
      const price = await Product.find({
        sourceCategoryName: { $regex: req.query.category || "", $options: "i" },
      }).distinct("price");
      res.status(200).json({
        products: products.map((product) => {
          return {
            ...product,
            image: product?.images[0]?.url || product?.mainImage?.url,
            rating: product.reviewSummary?.averageRating || 0,
            category: product.sourceCategoryName,
          };
        }),
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limitNumber),
          currentPage: pageNumber,
        },
        category: categories.map((category) => category.name),
        brands: Brands,
        price: price,
        tags: Tags,
      });
    } else {
      res.status(200).json({
        products: products.map((product) => {
          return {
            ...product,
            image: product?.images[0]?.url || product?.mainImage?.url,
            rating: product.reviewSummary?.averageRating || 0,
            category: product.sourceCategoryName,
          };
        }),
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limitNumber),
          currentPage: pageNumber,
        },
        category: categories.map((category) => category.name),
        brands: [],
        price: [],
        tags: [],
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true },
    );
    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", product: {} });
    const reviews = await Review.find({ product: req.params.id , status: "approved" });
    if (!reviews)
      return res
        .status(404)
        .json({ message: "no reviews found", product: product });
    product.reviews = reviews;
    res
      .status(200)
      .json({ message: "Product found with reviews", product: product });
  } catch (err) {
    next(err);
  }
};

exports.postReview = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const productId = req.params?.id;
    const review = req.body;
    if(!productId) return res.status(400).json({ message: "Product id is required" });
    const user = await User.findById(userId);
    if (!user) {
      //anonymous user
      if (!review.rating || !review.comment)
        return res.status(400).json({ message: "Missing required fields" });
      const newReview = await Review.create({
        rating: review.rating,
        comment: review.comment,
        createdAt: new Date(),
        updatedAt: new Date(),
        date: new Date(Date.now()),
        verified: false,
        status: "pending",
        productId,
        userId: null,
        username: review.username,
      });
      if (!newReview)
        return res.status(500).json({ message: "Failed to create review" });
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      product.reviews.push(newReview._id);
      const updatedProduct = await product.save();
      if (!updatedProduct)
        return res
          .status(500)
          .json({ message: "Failed to add review to product" });
      await createReviewNotification(undefined, newReview.rating, false);
      return res
        .status(200)
        .json({ message: "Review created successfully", status: "pending" });
    }
    
    if(user.status === "blocked") return res.status(403).json({ message: "Your account has been blocked by the admin." });
    if (!review.rating || !review.comment)
      return res.status(400).json({ message: "Missing required fields" });
    const existedReview = await Review.findOne({
      userId: userId,
      product: productId,
    });
    if (existedReview) {
      const updatedReview = await Review.findOneAndUpdate(
        { userId: userId, product: productId },
        {
          rating: review.rating,
          comment: review.comment,
          verified: true,
          status: "pending",
          date: new Date(Date.now()),
        },
      );
      if (!updatedReview)
        return res.status(500).json({ message: "Failed to update review" });
      await createReviewNotification(user.name, newReview.rating, true);
      return res
        .status(200)
        .json({ message: "Review updated successfully", status: "pending" });
    }
    const newReview = await Review.create({
      userId: userId,
      product: productId,
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date(Date.now()),
      verified: true,
      status: "pending",
      username: user.name,
    });
    if (!newReview)
      return res.status(500).json({ message: "Failed to create review" });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.reviews.push(newReview._id);
    const updatedProduct = await product.save();
    if (!updatedProduct)
      return res
        .status(500)
        .json({ message: "Failed to add review to product" });
    user.reviews.push(newReview._id);
    const updatedUser = await user.save();
    if (!updatedUser)
      return res.status(500).json({ message: "Failed to add review to user" });
    await createReviewNotification(user.name, newReview.rating, false);
    res.status(200).json({ message: "Review added successfully", status: "pending" });
  } catch (err) {
    next(err);
  }
};

exports.getLimitedSearchProducts = async (req, res, next) => {
  try {
    const { search } = req?.query;
    console.log(search);
    const Query = {};
    if (search) {
      Query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }
    const products = await Product.find(Query)
      .limit(5)
      .select("_id title price images");
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};
