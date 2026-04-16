const slugify = require("slugify");

function normalize(item) {
  return {
    title: item.title,
    slug: slugify(item.title, { lower: true }),
    shortDescription: item.shortDescription || "",
    description: item.description || "",
    seo: {
      title: item.title,
      description: item.shortDescription || ""
    },
    currency: item.price?.currency,
    brand: item.brand || "Unknown",
    stock: item.estimatedAvailabilities?.[0]?.estimatedAvailableQuantity || 0,
    availabilityStatus:
      item.estimatedAvailabilities?.[0]?.estimatedAvailabilityStatus || "UNKNOWN",
    source: {
      condition: item.condition,
      conditionDescription: item.conditionDescription,
      image: item.image?.imageUrl,
      additionalImages: item.additionalImages?.map(i => i.imageUrl) || [],
      discountPercentage:
        item.marketingPrice?.discountPercentage || null,
      discountAmount:
        item.marketingPrice?.discountAmount?.value || null,
      color: item.color || null
    }
  };
}

module.exports = { normalize };
