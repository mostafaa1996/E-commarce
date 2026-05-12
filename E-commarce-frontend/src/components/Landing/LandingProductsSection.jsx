import LandingProductCard from "./LandingProductCard";
import LandingSection from "./LandingSection";

export default function LandingProductsSection({ products , title , subtitle , badgeOverride }) {
  return (
    <LandingSection
      title={title}
      subtitle={subtitle}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {products && products.map((product) => (
          <LandingProductCard key={product._id} product={product} badgeOverride={badgeOverride} />
        ))}
      </div>
    </LandingSection>
  );
}
