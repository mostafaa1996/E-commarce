const getOrCreateCustomer = require("../utils/StripeCustomer.js");
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
exports.setUpPaymentMethods = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const customerId = await getOrCreateCustomer(userId);
    if (customerId === null)
      return res.status(500).json({ error: "Customer not found" });

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

exports.getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;
    const customerId = await getOrCreateCustomer(userId);
    if (customerId === null)
      return res.status(500).json({ error: "Customer not found" });

    const pms = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    // console.log(pms);
    const customer = await stripe.customers.retrieve(customerId);
    const defaultPm = customer.invoice_settings.default_payment_method;

    const cards = pms.data.map((pm) => ({
      id: pm.id,
      name: pm.billing_details?.name,
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      exp_month: pm.card?.exp_month,
      exp_year: pm.card?.exp_year,
      isDefault: pm.id === defaultPm,
    }));
    // console.log(cards);
    res.json({ cards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setCardAsDefault = async (req, res) => {
  try {
    const userId = req.user.id;
    const customerId = await getOrCreateCustomer(userId);
    if (customerId === null)
      return res.status(500).json({ error: "Customer not found" });

    const paymentMethodId = req.params.id;
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    res.json({
      message: "Payment method set as default",
      ok: true,
      defaultPaymentMethod: paymentMethodId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const customerId = await getOrCreateCustomer(userId);
    if (customerId === null)
      return res.status(500).json({ error: "Customer not found" });
    const paymentMethodId = req.params.id;
    await stripe.paymentMethods.detach(paymentMethodId);
    res.json({ message: "Payment method deleted", ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};