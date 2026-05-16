import LandingProductCard from "./LandingProductCard";
import LandingSection from "./LandingSection";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";

export default function LandingProductsSection({
  products,
  title,
  subtitle,
  badgeOverride,
}) {
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  return (
    <LandingSection title={title} subtitle={subtitle}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {products &&
          products.map((product) => (
            <LandingProductCard
              key={product._id}
              product={product}
              badgeOverride={badgeOverride}
              format={format}
              rate={rate}
            />
          ))}
      </div>
    </LandingSection>
  );
}
