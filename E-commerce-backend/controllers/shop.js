const product = require("../models/product");

//
//  API = /shop/products?
//   page=...&
//   limit=...&
//   search=...&
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
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
    tags,
  } = req.query;
  pageNumber = Number(page);
  limitNumber = Number(limit);
  const api_params = {};
  let sortOptions = {};
  if (search) {
    api_params.search = { $regex: search, $options: "i" };
  }
  if (category) {
    api_params.category = { $regex: category, $options: "i" };
  }
  if (brand) {
    api_params.brand = { $regex: brand, $options: "i" };
  }
  if (minPrice || maxPrice) {
    api_params.price = {};
    if (minPrice) api_params.price.$gte = Number(minPrice);
    if (maxPrice) api_params.price.$lte = Number(maxPrice);
  }
  if (tags) {
    api_params.tags = { $regex: tags, $options: "i" };
  }
  
  if (sort) {
    if (sort === "price-asc") sortOptions.price = 1;
    if (sort === "price-desc") sortOptions.price = -1;
    if (sort === "newest" || sort === "default") sortOptions.createdAt = -1;
    if (sort === "oldest") sortOptions.createdAt = 1;
    if (sort === "rating") sortOptions.rating = -1;
    if (sort === "Alphabetical") sortOptions.title = 1;
    if (sort === "ReverseAlphabetical") sortOptions.title = -1;
  }

  try {
    const products = await product
      .find({
        ...api_params,
        isActive: true,
      })
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    const totalItems = await Product.countDocuments(...api_params, {
      isActive: true,
    });
    res.status(200).json({
      products,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limitNumber),
        currentPage: pageNumber,
      },
    });
  } catch (err) {
    next(err);
  }
};
