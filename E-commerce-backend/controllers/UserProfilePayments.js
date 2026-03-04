
const  getOrCreateCustomer = require ("../utils/StripeCustomer.js");
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
exports.setUpPaymentMethods = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const customerId = await getOrCreateCustomer(userId);
    
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};