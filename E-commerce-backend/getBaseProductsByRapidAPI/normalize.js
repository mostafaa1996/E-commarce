function normalize(item, category) {
  return {
    title: item.product_title,

    description: "", 

    shortDescription: item.product_title,

    price: Number(
      item.product_price
        ? item.product_price.replace(/[^\d.]/g, "")
        : 0
    ),

    originalPrice: item.product_original_price
      ? Number(item.product_original_price.replace(/[^\d.]/g, ""))
      : null,

    currency: item.currency || "USD",

    category,

    brand: extractBrand(item.product_title),

    images: item.product_photo ? [{url:item.product_photo , color:""}] : [],

    rating: item.product_star_rating
      ? Number(item.product_star_rating)
      : null,

    reviewsCount: item.product_num_ratings || 0,

    tags: buildTags(item),

    productUrl: item.product_url,

    attributes: {
      color: [],
      size: [],
      storage: extractStorage(item.product_title)
    },

    stock: Math.floor(Math.random() * 50) + 5,

    source: {
      provider: "amazon",
      externalId: item.asin
    }
  };
}

function extractBrand(title) {
  if (!title) return "Unknown";
  return title.split(" ")[0]; 
}

function extractStorage(title) {
  if (!title) return [];

  const match = title.match(/(\d+)\s?(GB|TB)/i);
  return match ? [`${match[1]}${match[2].toUpperCase()}`] : [];
}

function buildTags(item) {
  const tags = [];

  if (item.is_amazon_choice) tags.push("Amazon Choice");
  if (item.is_best_seller) tags.push("Best Seller");
  if (item.is_prime) tags.push("Prime");

  if (item.product_badge) tags.push(item.product_badge);

  return tags;
}

module.exports.normalize = normalize;