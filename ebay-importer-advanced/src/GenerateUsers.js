require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/Product");

const MONGODB_URI =
  process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const USERS_TO_GENERATE = 1000;
const DEFAULT_LOGIN_PASSWORD = process.env.SEED_USER_PASSWORD || "User@123456";
const DEFAULT_LOGIN_PASSWORD_HASH =
  process.env.SEED_USER_PASSWORD_HASH ||
  "$2b$10$ix8W3Yr.r8iZPWAhqMZSV.ptuXpjvB/C4M10r0085NC6mFrWC7/s.";
const PRODUCTS_DIR = path.resolve(__dirname, "..", "output", "products");

const SOURCE_FILES = [
  "ebay-products-Computer Accessories.json",
  "ebay-products-Gaming Accessories.json",
  "ebay-products-Headphones-corrected.json",
  "ebay-products-Laptops-corrected.json",
  "ebay-products-Monitors.json",
  "ebay-products-Smart Home.json",
  "ebay-products-Smart Watches-corrected.json",
  "ebay-products-Smartphones-corrected.json",
  "ebay-products-Tablets-corrected.json",
  "ebay-products-Cameras.json",
];

const ORDER_SCENARIOS = [
  {
    weight: 38,
    status: "paid",
    paymentStatus: "succeeded",
    note: "Delivered successfully to customer address.",
    paidAt: true,
  },
  {
    weight: 23,
    status: "orderPlaced",
    paymentStatus: "succeeded",
    note: "Order packed and in shipping queue.",
    paidAt: true,
  },
  {
    weight: 17,
    status: "pending_payment",
    paymentStatus: "pending",
    note: "Awaiting customer payment confirmation.",
    paidAt: false,
  },
  {
    weight: 12,
    status: "cancelled",
    paymentStatus: "cancelled",
    note: "Order cancelled before shipment.",
    paidAt: false,
  },
  {
    weight: 10,
    status: "payment_failed",
    paymentStatus: "failed",
    note: "Payment attempt failed and order was not processed.",
    paidAt: false,
  },
];

const FIRST_NAMES = [
  "Ahmed", "Mohamed", "Mostafa", "Omar", "Sara", "Fatma", "Youssef", "Mariam",
  "Nour", "Laila", "Hassan", "Aya", "Mona", "Karim", "Salma", "Ziad",
  "Yara", "Khaled", "Nada", "Hana", "Adam", "Ali", "Mazen", "Rana",
  "Malak", "Kareem", "Tarek", "Jana", "Reem", "Samir", "Hoda", "Amr",
];

const LAST_NAMES = [
  "Hassan", "Ali", "Hamdy", "Khaled", "Ibrahim", "Mahmoud", "Nour", "Youssef",
  "Adel", "Fahmy", "Elsayed", "Mostafa", "Farouk", "Saber", "Salem", "Nassar",
  "Gaber", "Taha", "Ramadan", "Samy", "Kamel", "Helmy", "Shawky", "Zaki",
];

const CITIES = [
  "Cairo", "Alexandria", "Giza", "Mansoura", "Tanta", "Asyut", "Zagazig",
  "Suez", "Ismailia", "Port Said", "Luxor", "Minya", "Damanhur", "Fayoum",
];

const COUNTRIES = [
  "Egypt", "Saudi Arabia", "United Arab Emirates", "Jordan", "Kuwait",
  "Qatar", "Morocco", "United States",
];

const BIOS = [
  "Tech enthusiast who loves discovering new gadgets.",
  "Online shopper focused on quality electronics and accessories.",
  "Regular customer who compares specs carefully before buying.",
  "Interested in smart home devices, mobile accessories, and laptops.",
  "Enjoys finding good deals on everyday tech essentials.",
];

const STREET_NAMES = [
  "Tahrir", "Nile", "Palm", "Jasmine", "Victory", "Sunrise", "Liberty",
  "Garden", "Central", "Lotus", "Orchid", "Corniche", "King", "Canal",
];

const CARD_BRANDS = ["visa", "mastercard", "amex"];
const PAYMENT_METHODS = ["card", "cash_on_delivery", "paypal", "apple_pay"];
const FAILURE_CODES = ["card_declined", "insufficient_funds", "expired_card"];
const FAILURE_MESSAGES = [
  "Card was declined by the issuer.",
  "Customer card has insufficient funds.",
  "Payment method expired before confirmation.",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(probability) {
  return Math.random() < probability;
}

function choice(items) {
  return items[randInt(0, items.length - 1)];
}

function randomDigits(length) {
  let value = "";
  for (let i = 0; i < length; i += 1) {
    value += String(randInt(0, 9));
  }
  return value;
}

function randomAlphaNumeric(length) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";
  for (let i = 0; i < length; i += 1) {
    value += chars[randInt(0, chars.length - 1)];
  }
  return value;
}

function sampleSize(items, count) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, count);
}

function randomFloat(min, max, fractionDigits = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(fractionDigits));
}

function buildBirthDate() {
  const now = new Date();
  const age = randInt(19, 60);
  const year = now.getUTCFullYear() - age;
  const month = randInt(0, 11);
  const day = randInt(1, 28);
  return new Date(Date.UTC(year, month, day));
}

function buildStreetAddress() {
  return `${randInt(1, 250)} ${choice(STREET_NAMES)} St`;
}

function parseConcatenatedJsonObjects(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    const objects = [];
    let i = 0;

    while (i < text.length) {
      while (i < text.length && /\s/.test(text[i])) i += 1;
      if (i >= text.length) break;

      let start = i;
      let depth = 0;
      let inString = false;
      let escaped = false;
      let foundStart = false;

      for (; i < text.length; i += 1) {
        const ch = text[i];

        if (!foundStart) {
          if (ch === "{") {
            foundStart = true;
            depth = 1;
          }
          continue;
        }

        if (inString) {
          if (escaped) {
            escaped = false;
          } else if (ch === "\\") {
            escaped = true;
          } else if (ch === '"') {
            inString = false;
          }
          continue;
        }

        if (ch === '"') {
          inString = true;
        } else if (ch === "{") {
          depth += 1;
        } else if (ch === "}") {
          depth -= 1;
          if (depth === 0) {
            objects.push(JSON.parse(text.slice(start, i + 1)));
            i += 1;
            break;
          }
        }
      }
    }

    return objects;
  }
}

function weightedPick(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }

  return items[items.length - 1];
}

function randomDateBetween(from, to) {
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  return new Date(randInt(start, end));
}

function buildPhoneNumber() {
  return `01${randomDigits(9)}`;
}

function buildShippingAddress(firstName, lastName, email, phone) {
  return {
    fullName: `${firstName} ${lastName}`,
    address: buildStreetAddress(),
    city: choice(CITIES),
    postalCode: randomDigits(5),
    country: choice(COUNTRIES),
    phone,
    email,
  };
}

function extractProductsFromFiles() {
  const products = [];

  for (const fileName of SOURCE_FILES) {
    const fullPath = path.join(PRODUCTS_DIR, fileName);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing product source file: ${fullPath}`);
    }

    const records = parseConcatenatedJsonObjects(fullPath);

    for (const record of records) {
      if (record?.product?.itemId) {
        products.push(record.product);
      }
    }
  }

  return products;
}

function chooseWishlist(productIds) {
  const maxWishlistSize = Math.min(12, productIds.length);
  const wishlistSize = randInt(1, maxWishlistSize);
  return sampleSize(productIds, wishlistSize);
}

function chooseOrderProducts(dbProducts) {
  const uniqueCount = randInt(1, Math.min(4, dbProducts.length));
  const chosenProducts = sampleSize(dbProducts, uniqueCount);

  return chosenProducts.map((product) => {
    const quantity = randInt(1, 3);
    const price = Number(product.price || product.pricing?.minPrice || 0);
    const subtotal = Number((price * quantity).toFixed(2));

    return {
      quantity,
      price,
      subtotal,
      product: product._id,
    };
  });
}

function buildOrderDocument(userId, userProfile, dbProducts) {
  const orderItems = chooseOrderProducts(dbProducts);
  const itemsPrice = Number(
    orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
  );
  const shippingPrice = itemsPrice >= 250 ? 0 : randomFloat(4.99, 24.99, 2);
  const taxPrice = Number((itemsPrice * 0.14).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  const scenario = weightedPick(ORDER_SCENARIOS);
  const createdAt = randomDateBetween("2025-01-01T00:00:00.000Z", new Date());
  const updatedAt = randomDateBetween(createdAt, new Date());

  return {
    userId,
    orderItems,
    Notes: scenario.note,
    shippingAddress: buildShippingAddress(
      userProfile.firstName,
      userProfile.lastName,
      userProfile.email,
      userProfile.phone,
    ),
    paymentMethod: choice(PAYMENT_METHODS),
    status: scenario.status,
    paymentStatus: scenario.paymentStatus,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    totalItems: orderItems.reduce((sum, item) => sum + item.quantity, 0),
    selectedCardId: scenario.paymentStatus === "succeeded" ? randomAlphaNumeric(12) : null,
    createdAt,
    updatedAt,
    paidAt: scenario.paidAt ? randomDateBetween(createdAt, updatedAt) : null,
    paymentIntentId:
      scenario.paymentStatus === "succeeded"
        ? `pi_${randomAlphaNumeric(24)}`
        : null,
    paymentFailureReason:
      scenario.paymentStatus === "failed"
        ? {
            code: choice(FAILURE_CODES),
            message: choice(FAILURE_MESSAGES),
            type: "card_error",
          }
        : undefined,
  };
}

function buildUserDocument(index, passwordHash, productIds) {
  const gender = chance(0.52) ? "male" : "female";
  const firstName = choice(FIRST_NAMES);
  const lastName = choice(LAST_NAMES);
  const email = `${firstName}.${lastName}.${index}.${randomAlphaNumeric(4)}@seeded-shoplite.com`
    .replace(/\s+/g, "")
    .toLowerCase();
  const phone = buildPhoneNumber();
  const createdAt = randomDateBetween("2025-01-01T00:00:00.000Z", new Date());

  return {
    name: `${firstName} ${lastName}`,
    email,
    password: passwordHash,
    phone,
    role: "customer",
    PersonalInfo: {
      firstName,
      lastName,
      email,
      phone,
      DateOfBirth: buildBirthDate(),
      gender,
      location: `${choice(CITIES)}, ${choice(COUNTRIES)}`,
      Bio: choice(BIOS),
      avatar: {
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          `${firstName} ${lastName}`,
        )}&background=ffe9df&color=ff6b35`,
        publicId: null,
      },
      createdAt,
      updatedAt: createdAt,
    },
    wishlist: chooseWishlist(productIds),
    orders: [],
    notifications: [
      {
        message: "Welcome to ShopLite. Your account has been created successfully.",
        date: createdAt,
        seen: chance(0.7),
      },
    ],
    paymentMethods: chance(0.7)
      ? [
          {
            cardBrand: choice(CARD_BRANDS),
            last4: randomDigits(4),
            expiryMonth: randInt(1, 12),
            expiryYear: randInt(2026, 2031),
          },
        ]
      : [],
    Addresses: [],
    reviews: [],
    stripeCustomerId: chance(0.35) ? `cus_${randomAlphaNumeric(14)}` : null,
    emailVerified: chance(0.85),
  };
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  const sourceProducts = extractProductsFromFiles();
  const sourceItemIds = [...new Set(sourceProducts.map((product) => product.itemId))];

  await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});
  console.log("Connected to MongoDB.");

  const dbProducts = await Product.find(
    { itemId: { $in: sourceItemIds } },
    { _id: 1, itemId: 1, title: 1, price: 1, pricing: 1 },
  ).lean();

  if (!dbProducts.length) {
    throw new Error(
      "No products were found in MongoDB for the provided source files. Seed products first.",
    );
  }

  const dbProductsByItemId = new Map(dbProducts.map((product) => [product.itemId, product]));
  const matchedProducts = sourceItemIds
    .map((itemId) => dbProductsByItemId.get(itemId))
    .filter(Boolean);

  if (matchedProducts.length < 25) {
    throw new Error(
      `Only ${matchedProducts.length} matching products were found in MongoDB. That is too small to build realistic wishlists and orders.`,
    );
  }

  const productIds = matchedProducts.map((product) => product._id);
  const passwordHash = DEFAULT_LOGIN_PASSWORD_HASH;

  const usersPayload = Array.from({ length: USERS_TO_GENERATE }, (_, index) =>
    buildUserDocument(index + 1, passwordHash, productIds),
  );

  const insertedUsers = await User.insertMany(usersPayload, { ordered: false });
  console.log(`Inserted ${insertedUsers.length} users.`);

  const ordersPayload = [];
  const userOrderIds = new Map();

  for (const user of insertedUsers) {
    const userProfile = {
      firstName: user.PersonalInfo?.firstName || user.name.split(" ")[0],
      lastName:
        user.PersonalInfo?.lastName ||
        user.name.split(" ").slice(1).join(" ") ||
        "Customer",
      email: user.email,
      phone: user.phone,
    };

    const orderCount = weightedPick([
      { value: 0, weight: 8 },
      { value: 1, weight: 12 },
      { value: 2, weight: 14 },
      { value: 3, weight: 18 },
      { value: 4, weight: 18 },
      { value: 5, weight: 12 },
      { value: 6, weight: 8 },
      { value: 7, weight: 5 },
      { value: 8, weight: 3 },
      { value: 9, weight: 1 },
      { value: 10, weight: 1 },
    ]).value;

    for (let i = 0; i < orderCount; i += 1) {
      ordersPayload.push(buildOrderDocument(user._id, userProfile, matchedProducts));
    }
  }

  const insertedOrders = ordersPayload.length
    ? await Order.insertMany(ordersPayload, { ordered: false })
    : [];

  for (const order of insertedOrders) {
    const key = String(order.userId);
    if (!userOrderIds.has(key)) {
      userOrderIds.set(key, []);
    }
    userOrderIds.get(key).push(order._id);
  }

  const bulkUserUpdates = insertedUsers
    .filter((user) => userOrderIds.has(String(user._id)))
    .map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $set: {
            orders: userOrderIds.get(String(user._id)),
          },
        },
      },
    }));

  if (bulkUserUpdates.length) {
    await User.bulkWrite(bulkUserUpdates);
  }

  const statusCounts = insertedOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const paymentCounts = insertedOrders.reduce((acc, order) => {
    acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
    return acc;
  }, {});

  console.log(`Inserted ${insertedOrders.length} orders.`);
  console.log(`Matched ${matchedProducts.length} products from source files to MongoDB.`);
  console.log(`Shared login password for all generated users: ${DEFAULT_LOGIN_PASSWORD}`);
  console.log("Sample users:");
  insertedUsers.slice(0, 5).forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} | ${user.email} | ${user.phone}`);
  });
  console.log("Order status distribution:", statusCounts);
  console.log("Payment status distribution:", paymentCounts);
}

main()
  .catch((error) => {
    console.error("Failed to generate fake users:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
