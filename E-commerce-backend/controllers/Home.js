const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");

function formatHomeProduct(product) {
  return {
    _id: product._id,
    title: product.title,
    sourceCategoryName: product.sourceCategoryName,
    price: product.price,
    rating: product.reviewSummary?.averageRating || 0,
    image: product.mainImage?.url || product.images?.[0]?.url || null,
  };
}

exports.getDataForHomePage = async (req, res, next) => {
  try {
    const [categories, bestSellers, NewArrivals, TopRated, wishlistCounts, limitedDeals] =
      await Promise.all([
        Category.find({ isActive: true }).select("_id name keywords").lean().limit(10),
        Product.find({ isActive: true })
          .sort({
            soldCount: -1,
            createdAt: -1,
          })
          .limit(12)
          .select(
            "_id title sourceCategoryName price mainImage images reviewSummary",
          )
          .lean(),
        Product.find({ isActive: true })
          .sort({ createdAt: -1 })
          .limit(12)
          .select("_id title sourceCategoryName price mainImage images reviewSummary")
          .lean(),
        Product.find({ isActive: true })
          .sort({
            "reviewSummary.reviewsCount": -1,
            "reviewSummary.averageRating": -1,
            createdAt: -1,
          })
          .limit(12)
          .select("_id title sourceCategoryName price mainImage images reviewSummary")
          .lean(),
        User.aggregate([
          { $unwind: "$wishlist" },
          { $group: { _id: "$wishlist", wishlistCount: { $sum: 1 } } },
          { $sort: { wishlistCount: -1, _id: 1 } },
          { $limit: 12 },
        ]),
        Product.aggregate([
          { $match: { isActive: true } },
          { $unwind: "$variants" },
          {
            $match: {
              "variants.isActive": true,
              "variants.compareAtPrice": { $gt: 0 },
              $expr: { $lt: ["$variants.price", "$variants.compareAtPrice"] },
              "variants.expireDate": { $gt: new Date() },
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              sourceCategoryName: 1,
              image: {
                $ifNull: ["$mainImage.url", { $arrayElemAt: ["$images.url", 0] }],
              },
              variant: {
                _id: "$variants._id",
                price: "$variants.price",
                compareAtPrice: "$variants.compareAtPrice",
                expireDate: "$variants.expireDate",
              },
            },
          },
          { $sort: { sourceCategoryName: 1, "variant.expireDate": 1, _id: 1 } },
          {
            $group: {
              _id: "$sourceCategoryName",
              product: { $first: "$$ROOT" },
            },
          },
          { $sort: { "product.variant.expireDate": 1, "product._id": 1 } },
          { $limit: 3 },
          { $replaceRoot: { newRoot: "$product" } },
        ]).option({ allowDiskUse: true }),
      ]);

    const wishlistProductIds = wishlistCounts.map((item) => item._id);
    const wishlistedProducts = await Product.find({
      _id: { $in: wishlistProductIds },
      isActive: true,
    })
      .select("_id title sourceCategoryName price mainImage images reviewSummary")
      .lean();

    const wishlistedProductsMap = new Map(
      wishlistedProducts.map((product) => [String(product._id), product]),
    );
    const MostWishlisted = wishlistProductIds
      .map((id) => wishlistedProductsMap.get(String(id)))
      .filter(Boolean);

    return res.status(200).json({
      categories,
      bestSellers: bestSellers.map(formatHomeProduct),
      newArrivals: NewArrivals.map(formatHomeProduct),
      topRated: TopRated.map(formatHomeProduct),
      MostWishlisted: MostWishlisted.map(formatHomeProduct),
      limitedDeals: limitedDeals.map((product) => ({
        _id: product._id,
        title: product.title,
        category: product.sourceCategoryName,
        variant: product.variant,
        image: product.image || null,
      })),
    });
  } catch (err) {
    next(err);
  }
};

//categories --> _id, name , keywords
//bestSellers --> _id, title , sourceCategoryName , price , rating , image 
//NewArrivals --> _id, title , sourceCategoryName , price , rating , image
//TopRated --> _id, title , sourceCategoryName , price , rating , image
//MostWishlisted --> _id, title , sourceCategoryName , price , rating , image
//limitedDeals --> _id, title , variant[price , compareAtPrice , expireDate] , image
//customers reviews about the shop.
