const FinalNormalization = (products) => {
  const normalizedProducts = new Set();
  for (let i = 0; i < products.length; i += 1) {
    let obj = {};
    const product = products[i];
    if (product) {
      obj = {
        title: product?.title || "",
        slug: product?.slug || "",
        shortDescription: product?.shortDescription || "",
        description: product?.description || "",
        seo: product?.seo || "",
        currency: product?.currency || "USD",
        brand: product?.brand || "Unknown",
        stock: product?.stock || 0,
        availabilityStatus: product?.availabilityStatus || "InStock",
        condition: product?.source?.condition || "",
        conditionDescription: product?.source?.conditionDescription || "",
        image: product?.source?.image,
        additionalImages: product?.source?.additionalImages,
        discountPercentage: Number(product?.source?.discountPercentage) || 0,
        discountAmount: Number(product?.source?.discountAmount) || 0,
        color: product.source?.color?.split("/")[0]?.trim() || null,
      };
      normalizedProducts.add(obj);
    }
  }
  return normalizedProducts;
};

module.exports = FinalNormalization;
