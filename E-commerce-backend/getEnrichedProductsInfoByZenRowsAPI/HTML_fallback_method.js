const cheerio = require("cheerio");

function extractFromHtml(html) {
  const $ = cheerio.load(html);

  const images = extractGalleryImages($);
  const colors = extractColorVariants($);
  const sizes = extractSizeVariants($);
  const variants = buildVariants(colors, sizes);
  const sku = extractSku($);
  const reviews = extractReviews($);
  const reviewsCount = extractReviewsCount($);
  const additionalInfo = extractAdditionalInfo($);

  return {
    images,
    variants,
    sku,
    reviews,
    reviewsCount,
    additionalInfo
  };
}

function extractGalleryImages($) {
  const images = new Set();

  $("#altImages img").each((_, img) => {
    const hires = $(img).attr("data-old-hires");
    const src = $(img).attr("src");

    if (hires) images.add(hires);
    else if (src) images.add(src);
  });

  return [...images].map(url => ({
    url,
    color: null
  }));
}

function extractColorVariants($) {
  const colors = [];

  $("#variation_color_name li").each((_, el) => {
    const color = $(el).attr("title") || $(el).text();
    if (color) colors.push(color.replace("Click to select ", "").trim());
  });

  return colors;
}

function extractSizeVariants($) {
  const sizes = [];

  $("#variation_size_name li").each((_, el) => {
    const size = $(el).attr("title").trim() ||$(el).text().trim();
    if (size) sizes.push(size);
  });

  return sizes;
}

function buildVariants(colors, sizes) {
  const variants = [];

  if (colors.length && sizes.length) {
    colors.forEach(color => {
      sizes.forEach(size => {
        variants.push({ color, size });
      });
    });
  } else if (colors.length) {
    colors.forEach(color => variants.push({ color }));
  } else if (sizes.length) {
    sizes.forEach(size => variants.push({ size }));
  }

  return variants;
}

function extractSku($) {
  return (
    $("#productDetails_detailBullets_sections1 th:contains('ASIN')")
      .next()
      .text()
      .trim()
    ||
    $("#detailBullets_feature_div li:contains('ASIN')")
      .text()
      .replace("ASIN", "")
      .trim()
    ||
    null
  );
}

function extractReviews($) {
  const reviews = [];

  $(".review").each((_, el) => {
    const user = $(el).find(".a-profile-name").text().trim();
    const ratingText = $(el)
      .find(".review-rating span")
      .first()
      .text();

    const rating = ratingText
      ? Number(ratingText.split(" ")[0])
      : null;

    const comment = $(el)
      .find(".review-text-content span")
      .text()
      .trim();

    if (user || comment) {
      reviews.push({
        user: { name: user || "Anonymous" },
        rating,
        comment
      });
    }
  });

  return reviews;
}

function extractReviewsCount($) {
  const text = $("#acrCustomerReviewText").text();
  if (!text) return 0;

 
  const match = text.match(/([\d,]+)/);
  if (!match) return 0;

  return Number(match[1].replace(/,/g, ""));
}

function extractAdditionalInfo($) {
  const info = [];

  $("#productDetails_techSpec_section_1 tr").each((_, row) => {
    const key = $(row).find("th").text().trim();
    const value = $(row).find("td").text().trim();

    if (key && value) {
      info.push({ key, value });
    }
  });

  return info;
}

module.exports = {extractFromHtml};