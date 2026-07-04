const VAT_shipping = require("../models/VAT");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
async function calculateTax(cart) {
  const taxConfig = await VAT_shipping.findOne({}).select("vat").lean();
  const vatRate = Number(taxConfig?.vat) || 0;
  cart.TAX = cart.itemsPrice * vatRate;
}

async function checkCartAvailability(userId) {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;
  return cart;
}
async function getProductWithVariant(id, variantId) {
  const product = await Product.findById(id);
  if (!product) return null;
  const Variant = product.variants.find(
    (variant) => variant._id.toString() === variantId,
  );
  if (!Variant) return null;
  return { product, Variant };
}

async function checkItemAvailability(cart, productId, variantId) {
  const existingProduct = cart.products.find(
    (item) =>
      item.productId.toString() === productId &&
      item.variantId.toString() === variantId,
  );

  if (existingProduct) return existingProduct;

  return null;
}
async function UpdatingExistingItem(cart, existingProduct, Quantity) {
  const subtotal = Quantity * existingProduct.price;
  cart.totalItems += Quantity - existingProduct.quantity;
  cart.itemsPrice += subtotal - existingProduct.subtotal;
  existingProduct.quantity = Quantity;
  existingProduct.subtotal = subtotal;
  cart.updatedAt = Date.now();
}

async function addingNewProduct(cart, product , variant, Quantity) {
  cart.products.push({
    productId: product._id,
    variantId: variant._id,
    quantity: Quantity,
    price: variant.price,
    subtotal: variant.price * Quantity,
  });
  cart.totalItems += Quantity;
  cart.itemsPrice += variant.price * Quantity;
  cart.updatedAt = Date.now();
}

function recalculatePromoDiscount(cart) {
  if (!cart.promo?.code) return;

  if (cart.promo.discountType === "PERCENTAGE") {
    cart.promo.discountInMoney =
      cart.itemsPrice * (cart.promo.discountValue / 100);
  } else if (cart.promo.discountType === "FIXED") {
    cart.promo.discountInMoney = Math.min(
      cart.promo.discountValue,
      cart.itemsPrice,
    );
  }
}

function checkStock(variant, quantity) {
  if (variant.stock < quantity) return false;
  return true;
}

function checkVariantAvailability(variant) {
  if (!variant.isActive || variant.availabilityStatus === "OUT_OF_STOCK") return false;
  return true;
}

module.exports = {
  calculateTax,
  checkCartAvailability,
  getProductWithVariant,
  checkItemAvailability,
  UpdatingExistingItem,
  addingNewProduct,
  recalculatePromoDiscount,
  checkStock,
  checkVariantAvailability
};
