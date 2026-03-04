const User = require("../models/User");
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
async function getOrCreateCustomer(userId) {
  const user = await User.findById(userId);
  if (!user) return null;
  if (user.stripeCustomerId) return user.stripeCustomerId;
  const customer = await stripe.customers.create(
    {
      email: user.email,
      name: user.name,
      metadata: { userId },
    },
    { idempotencyKey: userId },
  );
  user.stripeCustomerId = customer.id;
  await user.save();
  return customer.id || null;
}

module.exports = getOrCreateCustomer;
