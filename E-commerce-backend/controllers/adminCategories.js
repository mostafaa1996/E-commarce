const mongoose = require("mongoose");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

function slugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function UploadToCloudinary(fileBuffer, categoryId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "E-commerce/Categories",
        public_id: `category_${categoryId}`,
        overwrite: true,
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    stream.end(fileBuffer);
  });
}

async  function normalizeImage(req , catId , fallbackAlt) {
  const result = await UploadToCloudinary(req.file.buffer, catId);
  if (!result) return null;
  return {
    icon: result.secure_url,
    alt: fallbackAlt,
  };
}

async function getParentMeta(parentId, currentCategoryId = null) {
  if (!parentId) {
    return {
      parent: null,
      ancestors: [],
    };
  }

  if (!isValidObjectId(parentId)) {
    return { error: "Invalid parent category ID" };
  }

  if (currentCategoryId && String(parentId) === String(currentCategoryId)) {
    return { error: "Category cannot be its own parent" };
  }

  const parentCategory = await Category.findById(parentId)
    .select("_id ancestors")
    .lean();

  if (!parentCategory) {
    return { error: "Parent category not found" };
  }

  return {
    parent: parentCategory._id,
    ancestors: [...(parentCategory.ancestors || []), parentCategory._id],
  };
}

async function refreshDescendantAncestors(categoryId) {
  const children = await Category.find({ parent: categoryId }).select("_id");

  for (const child of children) {
    const parentMeta = await getParentMeta(categoryId, child._id);

    if (parentMeta.error) {
      continue;
    }

    await Category.updateOne(
      { _id: child._id },
      {
        $set: {
          parent: parentMeta.parent,
          ancestors: parentMeta.ancestors,
        },
      },
    );

    await refreshDescendantAncestors(child._id);
  }
}

function formatCategory(category) {
  return {
    id: String(category._id),
    name: category.name,
    parent: category.parent
      ? {
          id: String(category.parent._id || category.parent),
          name: category.parent.name,
          slug: category.parent.slug,
        }
      : null,
    ancestors: Array.isArray(category.ancestors)
      ? category.ancestors.map((ancestor) => ({
          id: String(ancestor._id || ancestor),
          name: ancestor.name,
          slug: ancestor.slug,
        }))
      : [],
    icon: category.icon || { icon: "", alt: "" },
    keywords: category.keywords || "",
    attachedProductsCount: Array.isArray(category.attachedProducts)
      ? category.attachedProducts.length
      : 0,
    isActive: Boolean(category.isActive),
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

exports.getAdminCategories = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .populate("parent", "name")
      .populate("ancestors", "name")
      .select("name parent ancestors icon keywords attachedProducts isActive createdAt updatedAt")
      .lean();

    return res.status(200).json({
      message: "Categories fetched successfully",
      categories: categories.map(formatCategory),
    });
  } catch (err) {
    next(err);
  }
};

exports.addCategory = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    console.log(req.body);
    
    const body = req.body || {};
    const name = String(body.name || "").trim();
    const slug = slugify(body.name || "");

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const existingCategory = await Category.findOne({ slug })
      .select("_id")
      .lean();

    if (existingCategory) {
      return res.status(409).json({ message: "Category slug already exists" });
    }

    const parentMeta = await getParentMeta(body.parent || null);

    if (parentMeta.error) {
      return res.status(400).json({ message: parentMeta.error });
    }

    const category = new Category({
      name,
      slug,
      parent: parentMeta.parent,
      ancestors: parentMeta.ancestors,
      icon:{
        icon: String("").trim(),
        alt: String("").trim(),
      },
      keywords: String(body.keywords || "").trim(),
      attachedProducts: [],
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    const createdCategory = await category.save();

    const icon = await normalizeImage(req , createdCategory._id , "Category Icon");

    if (icon) {
      await Category.updateOne(
        { _id: createdCategory._id },
        { $set: { icon } },
      );
    }

    return res.status(201).json({
      message: "Category created successfully",
      category: formatCategory(createdCategory.toObject()),
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Category slug already exists" });
    }

    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const body = req.body || {};
    const nextName = String(body.name ?? category.name ?? "").trim();
    const nextSlug = slugify(body.slug ?? nextName);

    if (!nextName || !nextSlug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const duplicateCategory = await Category.findOne({
      slug: nextSlug,
      _id: { $ne: category._id },
    })
      .select("_id")
      .lean();

    if (duplicateCategory) {
      return res.status(409).json({ message: "Category slug already exists" });
    }

    const requestedParent =
      body.parent !== undefined ? body.parent || null : category.parent;
    const parentMeta = await getParentMeta(requestedParent, category._id);

    if (parentMeta.error) {
      return res.status(400).json({ message: parentMeta.error });
    }

    if (
      Array.isArray(parentMeta.ancestors) &&
      parentMeta.ancestors.some(
        (ancestorId) => String(ancestorId) === String(category._id),
      )
    ) {
      return res.status(400).json({
        message: "Category cannot be moved under one of its descendants",
      });
    }

    category.name = nextName;
    category.slug = nextSlug;
    category.parent = parentMeta.parent;
    category.ancestors = parentMeta.ancestors;
    category.icon =
      req.file !== undefined
        ? await normalizeImage(req , category._id , nextName)
        : category.icon;
    category.keywords = String(body.keywords ?? category.keywords ?? "").trim();
    category.isActive =
      body.isActive !== undefined ? Boolean(body.isActive) : category.isActive;

    const updatedCategory = await category.save();
    await refreshDescendantAncestors(updatedCategory._id);

    const populatedCategory = await Category.findById(updatedCategory._id)
      .populate("parent", "name slug")
      .populate("ancestors", "name slug")
      .select("name slug parent ancestors icon keywords attachedProducts isActive createdAt updatedAt")
      .lean();

    return res.status(200).json({
      message: "Category updated successfully",
      category: formatCategory(populatedCategory),
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Category slug already exists" });
    }

    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await Category.findById(req.params.id)
      .select("_id attachedProducts")
      .lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const childCategory = await Category.findOne({ parent: category._id })
      .select("_id")
      .lean();

    if (childCategory) {
      return res.status(400).json({
        message: "Cannot delete category with child categories",
      });
    }

    if (Array.isArray(category.attachedProducts) && category.attachedProducts.length > 0) {
      return res.status(400).json({
        message: "Cannot delete category with attached products",
      });
    }

    await Category.deleteOne({ _id: category._id });

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
