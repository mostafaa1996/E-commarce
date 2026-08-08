const Address = require("../models/Address");
const VAT_shipping = require("../models/VAT");
async function updateFinalTotalPrice(shippingCost, cart) {
  const taxConfig = await VAT_shipping.findOne({}).select("vat").lean();
  const vatRate = Number(taxConfig?.vat) || 0;
  cart.TAX = cart.itemsPrice * vatRate;

  const subtotalAfterDiscount = Math.max(
    cart.itemsPrice - (cart.promo?.discountInMoney || 0),
    0,
  );

  const total = subtotalAfterDiscount + cart.TAX + shippingCost;
  return total;
}

async function calculateShippingCost(userId){
  const address = await Address.findOne({ user: userId , isDefault: true });
  if (!address) return 0;
  const vatConfig = await VAT_shipping.findOne({}).select("delivery").lean();
  const normalizedDelivery = (vatConfig?.delivery || []).map((delivery) => ({
    ...delivery,
    place: String(delivery.place || "")
      .trim()
      .toLowerCase(),
  }));

  const locationParts = [address?.city, address?.state, address?.country]
    .filter(Boolean)
    .map((part) => String(part).trim().toLowerCase());

  const exactShippingLocation = normalizedDelivery.find((delivery) =>
    locationParts.includes(delivery.place),
  );

  return exactShippingLocation?.cost || 0;
}


module.exports = { 
    updateFinalTotalPrice,
    calculateShippingCost
 };
