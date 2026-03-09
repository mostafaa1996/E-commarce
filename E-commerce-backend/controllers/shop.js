const Product = require("../models/Product");
const categories = require("../getBaseProductsByRapidAPI/categories");

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
  } = req.query;
  console.log(req.query);
  pageNumber = Number(page);
  limitNumber = Number(limit);
  const api_params = {};
  let sortOptions = {};
  
  if (category && category !== "null" && category !== "") {
    api_params.category = { $regex: category, $options: "i" };
  }
  if (brands && Array.isArray(brands) && brands.length > 0) {
    api_params.brand = { $in : brands.map(brand => new RegExp(brand, "i")) };
  }
  if(brands && !Array.isArray(brands)){
    api_params.brand = { $regex: brands, $options: "i" };
  }
  if (
    (minPrice && minPrice !== "null" && minPrice !== "") &&
    (maxPrice && maxPrice !== "null" && maxPrice !== "" && maxPrice !== "0")
  ) {
    api_params.price = {};
    api_params.price.$gte = Number(minPrice);
    api_params.price.$lte = Number(maxPrice);
  }
  if (tags && Array.isArray(tags) && tags.length > 0) {
    api_params.tags = { $in : tags.map(tag => new RegExp(tag, "i")) };
  }
  if(tags && !Array.isArray(tags)){
    api_params.tags = { $regex: tags, $options: "i" };
  }
  if (sort && sort !== "null" && sort !== "") {
    if (sort === "price-asc") sortOptions.price = 1;
    if (sort === "price-desc") sortOptions.price = -1;
    if (sort === "newest" || sort === "default") sortOptions.createdAt = -1;
    if (sort === "oldest") sortOptions.createdAt = 1;
    if (sort === "rating") sortOptions.rating = -1;
    if (sort === "Alphabetical") sortOptions.title = 1;
    if (sort === "ReverseAlphabetical") sortOptions.title = -1;
  } else {
    sortOptions.createdAt = -1;
  }
  console.log(api_params);
  try {
    const products = await Product.find({
      ...api_params,
      isActive: true,
    })
      .select("_id title price images")
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    const totalItems = await Product.countDocuments(
      { ...api_params },
      {
        isActive: true,
      }
    );
    if (category && category !== "null" && category !== "") {
      const Brands = await Product.find({
        category: { $regex: req.query.category || "", $options: "i" },
      }).distinct("brand");
      const Tags = await Product.find({
        category: { $regex: req.query.category || "", $options: "i" },
      }).distinct("tags");
      const price = await Product.find({
        category: { $regex: req.query.category || "", $options: "i" },
      }).distinct("price");
      res.status(200).json({
        products,
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
        products,
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
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

exports.getLimitedSearchProducts = async (req, res, next) => {
  try {
    const {search} = req?.query ;
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
    const products = await Product.find(Query).limit(5).select("_id title price images");
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
}