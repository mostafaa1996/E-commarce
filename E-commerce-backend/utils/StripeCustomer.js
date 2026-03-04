const User = require("../models/User");
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
async function getOrCreateCustomer(userId) {
  const user = await User.findById(userId);
  if (!user) return null;
  if (user.stripeCustomerId){
    try{
      const customer = await stripe.customers.retrieve(user.stripeCustomerId);
      if(customer.deleted){
        user.stripeCustomerId = null;
        await user.save();
      }else{
        return user.stripeCustomerId;
      }
    }catch(err){
      console.log(err);
    }
  }
  console.log("Creating stripe customer");
  const customer = await stripe.customers.create(
    {
      email: user.email,
      name: user.name,
      metadata: { userId },
    },
    { idempotencyKey: `customer-${userId}` },
  );
  console.log("Stripe customer created");
  user.stripeCustomerId = customer.id;
  await user.save();
  return customer.id || null;
}

module.exports = getOrCreateCustomer;
