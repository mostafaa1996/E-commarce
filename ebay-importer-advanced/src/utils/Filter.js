const categoryRules = {
  Smartphones: {
    include: ["phone", "mobile", "smartphone"],
    exclude: [
      "case",
      "cover",
      "protector",
      "screen protector",
      "tempered",
      "glass",
      "film",
      "replacement",
      "housing",
      "back cover",
      "battery",
      "charger",
      "cable",
      "adapter",
      "dock",
      "holder",
      "stand",
      "mount",
      "clip",
      "ring",
      "magnifier",
      "lens",
      "repair",
      "tool",
      "kit",
      "parts",
      "lcd",
      "display only",
      "digitizer",
      "for parts",
      "broken",
      "dummy",
      "demo",
      "watch",
      "Earbuds",
      "Earphones",
      "Charging",
      "Wireless",
      "charge",
      "Stabilizer",
    ],
  },

  Laptops: {
    include: [
      "laptop",
      "notebook",
      "macbook",
      "ultrabook",
      "chromebook",
      "thinkpad",
    ],
    exclude: [
      "case",
      "bag",
      "sleeve",
      "cover",
      "charger",
      "adapter",
      "keyboard",
      "mouse",
      "screen protector",
      "stand",
      "cooling pad",
      "dock",
      "station",
      "replacement",
      "parts",
      "battery",
      "fan",
      "motherboard",
      "for parts",
      "broken",
    ],
  },

  "Smart Watches": {
    include: [
      "smart watch",
      "smartwatch",
      "apple watch",
      "fitness watch",
      "wearable",
    ],
    exclude: [
      "strap",
      "band",
      "bracelet",
      "watch band",
      "screen protector",
      "case",
      "cover",
      "charger",
      "dock",
      "cable",
      "replacement",
      "parts",
      "frame",
      "holder",
      "stand",
    ],
  },

  Headphones: {
    include: [
      "headphone",
      "earbuds",
      "earphone",
      "headset",
      "airpods",
      "wireless earbuds",
    ],
    exclude: [
      "case",
      "cover",
      "ear tips",
      "ear pads",
      "replacement",
      "parts",
      "cable only",
      "adapter",
      "jack",
      "holder",
      "stand",
      "cleaning kit",
    ],
  },

  Tablets: {
    include: ["tablet", "ipad", "android tablet", "tab", "galaxy tab"],
    exclude: [
      "case",
      "cover",
      "keyboard case",
      "screen protector",
      "glass",
      "pen",
      "stylus",
      "holder",
      "stand",
      "mount",
      "replacement",
      "parts",
      "battery",
      "for parts",
      "broken",
    ],
  },

  Monitors: {
    include: ["monitor", "display", "lcd monitor", "led monitor", "4k monitor"],
    exclude: [
      "stand only",
      "mount",
      "wall mount",
      "cable",
      "hdmi cable",
      "adapter",
      "screen protector",
      "cleaning kit",
      "replacement",
      "panel only",
      "parts",
      "broken",
    ],
  },

  "Gaming Accessories": {
    include: [
      "gaming mouse",
      "gaming keyboard",
      "controller",
      "gamepad",
      "joystick",
    ],
    exclude: [
      "skin",
      "cover",
      "case",
      "thumb grips",
      "caps",
      "charger",
      "cable",
      "replacement",
      "parts",
      "sticker",
      "decals",
    ],
  },

  Cameras: {
    include: ["camera", "dslr", "mirrorless", "action camera", "gopro"],
    exclude: [
      "lens cap",
      "bag",
      "case",
      "tripod",
      "mount",
      "strap",
      "battery",
      "charger",
      "cable",
      "adapter",
      "replacement",
      "parts",
      "cleaning kit",
    ],
  },

  "Smart Home": {
    include: [
      "smart speaker",
      "alexa",
      "google home",
      "smart bulb",
      "smart plug",
      "smart device",
    ],
    exclude: [
      // "case",
      // "cover",
      // "holder",
      // "stand",
      // "mount",
      // "replacement",
      // "parts",
      // "cable",
      // "adapter",
      // "manual",
      // "guide",
    ],
  },

  "Computer Accessories": {
    include: [
      "usb hub",
      "external hard drive",
      "ssd",
      "keyboard",
      "mouse",
      "webcam",
    ],
    exclude: [
      "case",
      "cover",
      "bag",
      "cable only",
      "adapter only",
      "replacement",
      "parts",
      "holder",
      "stand",
      "cleaning kit",
    ],
  },
};

const score = (str, Includekeywords, Excludekeywords) => {
  let score = 0;
  for (const keyword of Includekeywords) {
    if (str.includes(keyword)) {
      score += 1;
    }
  }

  for (const keyword of Excludekeywords) {
    if (str.includes(keyword)) {
      score -= 3;
    }
  }
  return score;
};
const Filter = (item, category) => {
  // console.log(item.itemId, "..............", category);
  if (item?.title) {
    const target = score(
      item.title.toLowerCase(),
      categoryRules[category].include,
      categoryRules[category].exclude,
    );
    if (target <= 0) {
      return false;
    } else {
      return true;
    }
  }
};

const hasCoreInfo = (product) => {
  if (
    product?.mainImage &&
    product?.images?.length > 3 &&
    product?.specifications?.length > 5 &&
    product?.description?.length > 100 &&
    product?.title?.length > 10 &&
    product?.shortDescription?.length > 50 &&
    product?.brand !== "Unbranded"
  ) {
    return true;
  }
  return false;
};

module.exports = { Filter, hasCoreInfo };
