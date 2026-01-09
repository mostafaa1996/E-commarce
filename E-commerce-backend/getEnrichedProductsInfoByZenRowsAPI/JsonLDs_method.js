function extractProductData(html) {
  const jsonLds = extractJsonLd(html);
  const productJson = getProductJsonLd(jsonLds);

  if (!productJson) return null;

  return {
    ...extractFromJsonLd(productJson),
    variants: extractVariants(productJson),
    additionalInfo: extractAdditionalInfo(productJson)
  };
}
function extractJsonLd(html) {
  const scripts = [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )];

  return scripts
    .map(m => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function getProductJsonLd(jsonLds) {
  return jsonLds.find(j =>
    j["@type"] === "Product" ||
    (Array.isArray(j["@type"]) && j["@type"].includes("Product"))
  );
}

function extractFromJsonLd(productJson) {
  if (!productJson) return {};

  const offers = Array.isArray(productJson.offers)
    ? productJson.offers[0]
    : productJson.offers;

  return {
    // ===== Descriptions =====
    longDescription: productJson.description || null,

    shortDescription: productJson.name
      ? productJson.name.split("|")[0].trim()
      : null,

    // ===== Images =====
    images: extractGalleryImages(productJson),

    // ===== SKU =====
    sku: productJson.sku || productJson.mpn || null,

    // ===== Stock =====
    stock: offers?.availability
      ? availabilityToStock(offers.availability)
      : null,

    // ===== Price =====
    price: offers?.price
      ? Number(offers.price)
      : null,

    currency: offers?.priceCurrency || null,

    // ===== Reviews =====
    reviewsCount: productJson.aggregateRating?.reviewCount
      ? Number(productJson.aggregateRating.reviewCount)
      : 0,

    rating: productJson.aggregateRating?.ratingValue
      ? Number(productJson.aggregateRating.ratingValue)
      : null,

    reviews: extractReviews(productJson.review)
  };
}

//Helper functions
function availabilityToStock(value) {
  if (!value) return null;
  if (value.includes("InStock")) return 10;
  if (value.includes("OutOfStock")) return 0;
  return null;
}

function extractReviews(reviews) {
  if (!reviews) return [];

  const list = Array.isArray(reviews) ? reviews : [reviews];

  return list.map(r => ({
    user: {
      name: r.author?.name || "Anonymous"
    },
    rating: r.reviewRating?.ratingValue
      ? Number(r.reviewRating.ratingValue)
      : null,
    comment: r.reviewBody || "",
    createdAt: r.datePublished
      ? new Date(r.datePublished)
      : null
  }));
}

function extractVariants(productJson) {
  if (!productJson.hasVariant) return [];

  const variants = Array.isArray(productJson.hasVariant)
    ? productJson.hasVariant
    : [productJson.hasVariant];

  return variants.map(v => ({
    color: v.color || null,
    size: v.size || null,
    price: v.offers?.price
      ? Number(v.offers.price)
      : null,
    stock: v.offers?.availability
      ? availabilityToStock(v.offers.availability)
      : null,
    Storage: v.storage || null
  }));
}

function extractAdditionalInfo(productJson) {
  if (!productJson?.additionalProperty) return [];

  return productJson.additionalProperty
    .filter(p => p.name && p.value)
    .map(p => ({
      key: p.name.trim(),
      value: String(p.value).trim()
    }));
}

function extractImages(productJson) {
  const imgs = Array.isArray(productJson.image)
    ? productJson.image
    : productJson.image
      ? [productJson.image]
      : [];

  return imgs.map(url => ({
    url,
    color: null
  }));
}


module.exports = {
  extractProductData
};