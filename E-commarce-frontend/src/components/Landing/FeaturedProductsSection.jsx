import LandingProductCard from "./LandingProductCard";
import LandingSection from "./LandingSection";

export default function FeaturedProductsSection({ products }) {
  return (
    <LandingSection
      title="Featured Products"
      subtitle="Our customers' favorites this month"
      action="View all"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <LandingProductCard key={product.id} product={product} />
        ))}
      </div>
    </LandingSection>
  );
}
