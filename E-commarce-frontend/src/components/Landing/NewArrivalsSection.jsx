import LandingProductCard from "./LandingProductCard";
import LandingSection from "./LandingSection";

export default function NewArrivalsSection({ products }) {
  return (
    <LandingSection
      title="New Arrivals"
      subtitle="Fresh tech, just landed"
      action="See more"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {products.map((product) => (
          <LandingProductCard
            key={product.id}
            product={product}
            badgeOverride="New"
          />
        ))}
      </div>
    </LandingSection>
  );
}
