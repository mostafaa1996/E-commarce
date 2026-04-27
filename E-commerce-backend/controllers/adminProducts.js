const { on } = require("../models/ExchangeRate");
const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePositiveNumber(value, fallback) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

function getProductStock(product) {
  if (typeof product?.inventory?.totalStock === "number") {
    return product.inventory.totalStock;
  }

  if (Array.isArray(product?.variants) && product.variants.length > 0) {
    return product.variants.reduce((sum, variant) => {
      return sum + (variant.stock || 0);
    }, 0);
  }

  return 0;
}

function getProductPrice(product) {
  return product?.pricing?.minPrice || product?.price || 0;
}

function getProductImage(product) {
  return product?.mainImage?.url || product?.images?.[0]?.url || null;
}

function getProductCategoryName(product) {
  return product?.sourceCategoryName || "Uncategorized";
}

function generateItemId() {
  return (
    "v1|" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 5)
  );
}

exports.getAdminProducts = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const page = normalizePositiveNumber(req.query.page, 1);
    const limit = Math.min(normalizePositiveNumber(req.query.limit, 8), 100);
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "All Status").trim();
    const category = String(req.query.category || "All Categories").trim();

    const query = {};

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      query.$or = [
        { title: searchRegex },
        { itemId: searchRegex },
        { slug: searchRegex },
        { brand: searchRegex },
        { sourceCategoryName: searchRegex },
        { tags: searchRegex },
      ];
    }

    if (
      category &&
      category !== "All Categories" &&
      category.toLowerCase() !== "all"
    ) {
      query.sourceCategoryName = new RegExp(`^${escapeRegex(category)}$`, "i");
    }

    if (status && status !== "All Status" && status.toLowerCase() !== "all") {
      const normalizedStatus = status.toLowerCase();

      if (normalizedStatus === "active") {
        query.isActive = true;
      } else if (normalizedStatus === "draft") {
        query.isActive = false;
      } else {
        query.status = new RegExp(`^${escapeRegex(status)}$`, "i");
      }
    }

    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          [
            "itemId",
            "title",
            "slug",
            "brand",
            "sourceCategoryName",
            "price",
            "pricing",
            "inventory",
            "variants",
            "mainImage",
            "images",
            "shortDescription",
            "description",
            "isActive",
            "status",
            "createdAt",
          ].join(" "),
        )
        .lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalProducts / limit));

    const formattedProducts = products.map((product) => {
      const stock = getProductStock(product);

      return {
        id: String(product._id),
        itemId: product.itemId,
        name: product.title,
        category: getProductCategoryName(product),
        price: getProductPrice(product),
        stock,
        status: product.isActive ? "Active" : "Draft",
        date: product.createdAt,
        image: getProductImage(product),
        brand: product.brand || "",
      };
    });

    return res.status(200).json({
      message: "Admin products fetched successfully",
      products: formattedProducts,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        search,
        status,
        category,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    const body = req.body || {};
    const title = String(body.title || body.name || "").trim();
    const slug =
      String(body.slug || "")
        .trim()
        .toLowerCase() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (!title || !slug) {
      return res.status(400).json({ message: "Title and slug are required" });
    }
    const itemId = String(body.itemId || generateItemId()).trim();
    const normalizedImages = Array.isArray(body.images)
      ? body.images.filter(Boolean).map((image) =>
          typeof image === "string"
            ? { url: image, alt: title }
            : {
                url: image.url,
                alt: image.alt || title,
              },
        )
      : [];

    const normalizedMainImage = body.mainImage
      ? typeof body.mainImage === "string"
        ? { url: body.mainImage, alt: title }
        : {
            url: body.mainImage.url,
            alt: body.mainImage.alt || title,
          }
      : normalizedImages[0] || undefined;

    const rawVariants =
      Array.isArray(body.variants) && body.variants.length > 0
        ? body.variants
        : [
            {
              sku: body.sku || `SKU-${Date.now()}`,
              price: Number(body.price || 0),
              stock: Number(body.stock || body?.inventory?.totalStock || 0),
              images: normalizedMainImage ? [normalizedMainImage] : [],
              isActive: true,
            },
          ];

    const normalizedVariants = rawVariants.map((variant, index) => ({
      ...variant,
      sku: String(
        variant.sku ||
          `SKU-${variant.attributes?.color?.hex || ""}-${variant.attributes?.size || ""}-${variant.attributes?.storage || ""}-${variant.attributes?.ram || ""}-${variant.attributes?.ssd || ""}`,
      ),
      price: Number(variant.price || body.price || 0),
      stock: Number(variant.stock || 0),
      images: Array.isArray(variant.images)
        ? variant.images.map((image) =>
            typeof image === "string"
              ? { url: image, alt: title }
              : {
                  url: image.url,
                  alt: image.alt || title,
                  colorHint: image.colorHint,
                },
          )
        : normalizedMainImage
          ? [normalizedMainImage]
          : [],
    }));

    const prices = normalizedVariants.map((variant) =>
      Number(variant.price || 0),
    );
    const stocks = normalizedVariants.map((variant) =>
      Number(variant.stock || 0),
    );

    const product = new Product({
      ...body,
      itemId: itemId,
      title,
      slug,
      description: String(body.description || ""),
      shortDescription: String(body.shortDescription || ""),
      brand: String(body.brand || ""),
      category:
        (await Category.findOne({ name: String(body.category || "") }))._id ||
        null,
      sourceCategoryName: String(body.sourceCategoryName || ""),
      currency: String(body.currency || "USD"),
      price: Number(body.price || Math.min(...prices) || 0),
      specifications: Array.isArray(body.specifications)
        ? body.specifications
        : [],
      mainImage: normalizedMainImage,
      images: normalizedImages,
      variants: normalizedVariants,
      hasVariants: normalizedVariants.length > 0,
      pricing: {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
      },
      inventory: {
        totalStock: stocks.reduce((sum, stock) => sum + stock, 0),
      },
      isActive: Boolean(body.isActive),
      status: String(body.status || "Unknown"),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      tags: Array.isArray(body.tags) ? body.tags : [],
      seo: {
        metaTitle: String(body.seo.metaTitle || title),
        metaDescription: String(body.seo.metaDescription || ""),
      },
      shipping: {
        estimatedDeliveryMinDate: String(
          body.shipping.estimatedDeliveryMinDate || "",
        ),
        estimatedDeliveryMaxDate: String(
          body.shipping.estimatedDeliveryMaxDate || "",
        ),
        shipsFrom: String(body.shipping.shipsFrom || ""),
        costs: body?.shipping?.costs?.map((cost) => {
            return {
                shipsTo: String(cost.shipsTo || ""),
                cost: Number(cost.cost || 0),
            }
        }) || [],
      },
      returnPolicy: {
        isReturnAccepted: String(body.returnPolicy.isReturnAccepted || ""),
        returnWindowDays: String(body.returnPolicy.returnWindowDays || ""),
        returnFeesPaidBy: String(body.returnPolicy.returnFeesPaidBy || ""),
        notes: String(body.returnPolicy.notes || ""),
      },
      reviewSummary: {
        averageRating: 5,
        reviewsCount: 0,
        ratingBreakdown:{
            one: 0,
            two: 0,
            three: 0,
            four: 0,
            five: 0,
          },
      },
      soldCount: 0,
      viewsCount: 0,
      defaultVariantId: new mongoose.Types.ObjectId("000000000000000000000000"),
    });

    const createdProduct = await product.save();

    if (!createdProduct) {
      return res.status(500).json({ message: "Failed to create product" });
    }

    createdProduct.defaultVariantId = createdProduct?.variants?.[0]._id;
    await createdProduct.save();

    await Category.updateOne(
        { _id: product.category },
        { $push: { attachedProducts: product._id } },
    );

    return res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const product = await Product.findById(req.params.id);
    console.log(product);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const body = req.body || {};
    const title = String(body.title || body.name || product.title || "").trim();
    const slug =
      String(body.slug || "")
        .trim()
        .toLowerCase() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      product.slug;

    if (!title || !slug) {
      return res.status(400).json({ message: "Title and slug are required" });
    }

    const shipping = body.shipping || {};
    const returnPolicy = body.returnPolicy || {};
    const reviewSummary = body.reviewSummary || {};
    const existingMainImage = product.mainImage?.url
      ? product.mainImage
      : undefined;
    const existingImages = Array.isArray(product.images) ? product.images : [];

    const normalizedImages = Array.isArray(body.images)
      ? body.images.filter(Boolean).map((image) =>
          typeof image === "string"
            ? { url: image, alt: title }
            : {
                url: image.url,
                alt: image.alt || title,
              },
        )
      : existingImages;

    const normalizedMainImage = body.mainImage
      ? typeof body.mainImage === "string"
        ? { url: body.mainImage, alt: title }
        : {
            url: body.mainImage.url,
            alt: body.mainImage.alt || title,
          }
      : normalizedImages[0] || existingMainImage;

    const rawVariants =
      Array.isArray(body.variants) && body.variants.length > 0
        ? body.variants
        : Array.isArray(product.variants) && product.variants.length > 0
          ? product.variants
          : [
              {
                sku:
                  body.sku ||
                  product.sku ||
                  `SKU-${variant.attributes?.color?.hex || ""}-${variant.attributes?.size || ""}-${variant.attributes?.storage || ""}-${variant.attributes?.ram || ""}-${variant.attributes?.ssd || ""}`,
                price: Number(body.price || product.price || 0),
                stock: Number(
                  body.stock ||
                    body?.inventory?.totalStock ||
                    product?.inventory?.totalStock ||
                    0,
                ),
                images: normalizedMainImage ? [normalizedMainImage] : [],
                isActive: true,
              },
            ];

    const normalizedVariants = rawVariants.map((variant) => ({
      ...variant,
      sku: String(
        variant.sku ||
          `SKU-${variant.attributes?.color?.hex || ""}-${variant.attributes?.size || ""}-${variant.attributes?.storage || ""}-${variant.attributes?.ram || ""}-${variant.attributes?.ssd || ""}`,
      ),
      price: Number(variant.price || body.price || product.price || 0),
      stock: Number(variant.stock || 0),
      images: Array.isArray(variant.images)
        ? variant.images.map((image) =>
            typeof image === "string"
              ? { url: image, alt: title }
              : {
                  url: image.url,
                  alt: image.alt || title,
                  colorHint: image.colorHint,
                },
          )
        : normalizedMainImage
          ? [normalizedMainImage]
          : [],
    }));

    const prices = normalizedVariants.map((variant) =>
      Number(variant.price || 0),
    );
    const stocks = normalizedVariants.map((variant) =>
      Number(variant.stock || 0),
    );
    const matchedCategory = body.category
      ? await Category.findOne({ name: String(body.category || "") })
          .select("_id")
          .lean()
      : null;

    product.itemId = String(
      body.itemId || product.itemId || generateItemId(),
    ).trim();
    product.title = title;
    product.slug = slug;
    product.description = String(body.description ?? product.description ?? "");
    product.shortDescription = String(
      body.shortDescription ?? product.shortDescription ?? "",
    );
    product.brand = String(body.brand ?? product.brand ?? "");
    product.category = matchedCategory?._id || product.category || null;
    product.sourceCategoryName = String(
      body.sourceCategoryName ?? product.sourceCategoryName ?? "",
    );
    product.currency = String(body.currency || product.currency || "USD");
    product.price = Number(
      body.price || Math.min(...prices) || product.price || 0,
    );
    product.specifications = Array.isArray(body.specifications)
      ? body.specifications
      : Array.isArray(product.specifications)
        ? product.specifications
        : [];
    product.mainImage = normalizedMainImage;
    product.images = normalizedImages;
    product.variants = normalizedVariants;
    product.hasVariants = normalizedVariants.length > 0;
    product.pricing = {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
    product.inventory = {
      totalStock: stocks.reduce((sum, stock) => sum + stock, 0),
    };
    product.isActive =
      body.isActive !== undefined ? Boolean(body.isActive) : product.isActive;
    product.status = String(body.status || product.status || "New");
    product.updatedAt = new Date(Date.now());
    product.tags = Array.isArray(body.tags)
      ? body.tags
      : Array.isArray(product.tags)
        ? product.tags
        : [];
    product.seo = {
      metaTitle: String(body.seo?.metaTitle || product?.seo?.metaTitle || title),
      metaDescription: String(
        body.seo?.metaDescription || product?.seo?.metaDescription || "",
      ),
    };
    product.shipping = {
      estimatedDeliveryMinDate: String(
        body?.shipping.estimatedDeliveryMinDate ||
          product?.shipping?.estimatedDeliveryMinDate ||
          "",
      ),
      estimatedDeliveryMaxDate: String(
        body?.shipping.estimatedDeliveryMaxDate ||
          product?.shipping?.estimatedDeliveryMaxDate ||
          "",
      ),
      shipsFrom: String(
        body?.shipping.shipsFrom || product?.shipping?.shipsFrom || "",
      ),
      costs: body?.shipping.costs || product?.shipping?.costs || [],
    };
    product.returnPolicy = {
      isReturnAccepted:
        returnPolicy.isReturnAccepted !== undefined
          ? returnPolicy.isReturnAccepted
          : product?.returnPolicy?.isReturnAccepted || false,
      returnWindowDays: Number(
        returnPolicy.returnWindowDays ||
          product?.returnPolicy?.returnWindowDays ||
          0,
      ),
      returnFeesPaidBy: String(
        returnPolicy.returnFeesPaidBy ||
          product?.returnPolicy?.returnFeesPaidBy ||
          "",
      ),
      notes: String(returnPolicy.notes || product?.returnPolicy?.notes || ""),
    };
    product.defaultVariantId =
      body.defaultVariantId ||
      product.defaultVariantId ||
      normalizedVariants?.[0]?._id ||
      null;

    const updatedProduct = await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const product = await Product.findById(req.params.id).select(
      "_id category",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.deleteOne({ _id: product._id });

    if (product.category) {
      await Category.updateOne(
        { _id: product.category },
        { $pull: { attachedProducts: product._id } },
      );
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.getSingleProductById = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const product = await Product.findById(req.params.id)
      .populate("reviews")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Admin product fetched successfully",
      product,
    });
  } catch (err) {
    next(err);
  }
};
