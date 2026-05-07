const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose");

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

async function recalculateProductReviewSummary(productId) {
  if (!productId) return;

  const stats = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        isApproved: true,
      },
    },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
  ]);

  const ratingBreakdown = {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
  };

  let reviewsCount = 0;
  let totalRating = 0;

  for (const item of stats) {
    const rating = Number(item._id);
    const count = item.count;

    reviewsCount += count;
    totalRating += rating * count;

    if (rating === 1) ratingBreakdown.one = count;
    if (rating === 2) ratingBreakdown.two = count;
    if (rating === 3) ratingBreakdown.three = count;
    if (rating === 4) ratingBreakdown.four = count;
    if (rating === 5) ratingBreakdown.five = count;
  }

  const averageRating =
    reviewsCount > 0 ? Number((totalRating / reviewsCount).toFixed(1)) : 0;

  await Product.findByIdAndUpdate(productId, {
    $set: {
      "reviewSummary.averageRating": averageRating,
      "reviewSummary.reviewsCount": reviewsCount,
      "reviewSummary.lastSyncedAt": new Date(),
      "reviewSummary.ratingBreakdown": ratingBreakdown,
    },
  });
}
exports.getAdminProductsReviews = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res
        .status(401)
        .json({ message: "this page is for admin only , Unauthorized Access" });
    const page = req.query.page || 1;
    const limit = req.query.limit || 6;
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "all").trim();
    const rating = String(req.query.rating || "all").trim();
    const matchStage = {};
    const searchMatchStage = {};

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");

      searchMatchStage.$or = [
        { username: searchRegex },
        { "productData.title": searchRegex },
        { "userData.name": searchRegex },
        { "userData.email": searchRegex },
      ];
    }
    if (status && status.toLowerCase() !== "all") {
      if (status === "approved") {
        matchStage.isApproved = true;
      }

      if (status === "pending" || status === "rejected") {
        matchStage.isApproved = false;
      }
    }
    if (rating && rating.toLowerCase() !== "all") {
      const numericRating = Number(rating);

      if (
        !Number.isNaN(numericRating) &&
        numericRating >= 1 &&
        numericRating <= 5
      ) {
        matchStage.rating = numericRating;
      }
    }

    const pipeline = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (search && search !== "") {
      pipeline.push({
        $match: searchMatchStage,
      });
    }

    pipeline.push(
      {
        $sort: {
          date: -1,
          createdAt: -1,
        },
      },
      {
        $facet: {
          reviews: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $project: {
                _id: 1,
                rating: 1,
                comment: 1,
                username: 1,
                isApproved: 1,
                verified: 1,
                date: 1,
                createdAt: 1,
                updatedAt: 1,

                product: {
                  _id: "$productData._id",
                  title: "$productData.title",
                },

                user: {
                  _id: "$userData._id",
                  name: "$userData.name",
                  email: "$userData.email",
                },
              },
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      }
    );

    const result = await Review.aggregate(pipeline);
    const reviews = result[0]?.reviews || [];
    const totalItems = result[0]?.totalCount?.[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          approvedReviews: {
            $sum: {
              $cond: [{ $eq: ["$isApproved", true] }, 1, 0],
            },
          },
          pendingReviews: {
            $sum: {
              $cond: [{ $eq: ["$isApproved", false] }, 1, 0],
            },
          },
          verifiedReviews: {
            $sum: {
              $cond: [{ $eq: ["$verified", true] }, 1, 0],
            },
          },
          averageRating: {
            $avg: "$rating",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalReviews: 1,
          approvedReviews: 1,
          pendingReviews: 1,
          verifiedReviews: 1,
          averageRating: {
            $round: ["$averageRating", 1],
          },
        },
      },
    ]);

    res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
      pagination: {
        page,
        totalPages,
        totalItems,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        search,
        status,
        rating,
      },
      stats: stats[0] || {
        totalReviews: 0,
        approvedReviews: 0,
        pendingReviews: 0,
        verifiedReviews: 0,
        averageRating: 0,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.updateReviewStatus = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res
        .status(401)
        .json({ message: "this page is for admin only , Unauthorized Access" });
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({ message: "Invalid review id" });
    }
    const { status } = req.body;
    if(typeof status !== "boolean"){
      return res.status(400).json({ message: "Status is required and must be a boolean" });
    }
    if (typeof status === "boolean") {
      const review = await Review.findByIdAndUpdate(
        id,
        { isApproved: status },
        { new: true, runValidators: true }
      );
      if (!review) {
        return res.status(404).json({ message: "Review not found." });
      }
      await recalculateProductReviewSummary(review.product);
      return res.status(200).json({
        message: "Review status updated successfully",
        review,
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.deleteReview = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({
        message: "This page is for admin only, Unauthorized Access",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Review id is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review id.",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // Remove review reference from product, if product exists
    if (review.product) {
      await Product.findByIdAndUpdate(review.product, {
        $pull: { reviews: review._id },
      });
    }

    // Remove review reference from user, if user exists
    if (review.userId) {
      await User.findByIdAndUpdate(review.userId, {
        $pull: { reviews: review._id },
      });
    }

    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Review deleted successfully",
      deletedReviewId: id,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
