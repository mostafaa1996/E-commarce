import cartlarge from "/cart_large.svg"
import cup from "/cup.svg"
import chatRoundCheck from "/chat_round_check.svg"
import tag_price from "/tag_price.svg"
import FeatureItem from "../genericComponents/featureItem"

const features = [
  {
    title: "Free Delivery",
    description: "Get your purchases delivered right to your doorsteps for free.",
    icon: cartlarge,
  },
  {
    title: "Quality Guarantee",
    description: "Our products are backed by a quality guarantee. Your satisfaction is our top priority.",
    icon: cup,
  },
  {
    title: "Daily Offers",
    description: "Get the best deals of the day. Check back daily for exciting offers.",
    icon: chatRoundCheck,
  },
  {
    title: "100% Secure Payment",
    description: "We prioritize the security of your payment information. Shop with peace of mind knowing your transactions are secure.",
    icon: tag_price,
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-10
        ">
          {features.map((feature) => (
            <FeatureItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
