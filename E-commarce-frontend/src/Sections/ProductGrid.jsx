import LandingProductCard from "@/components/Landing/LandingProductCard";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";

export default function ProductGrid({ products }) {
  const MainProducts = products.map((product) => product);
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  return (
    <div className="max-w-8xl grid grid-cols-1 lg:grid-cols-3 gap-6">
      {MainProducts.map((product) => (
        <LandingProductCard
          key={product._id}
          product={product}
          format={format}
          rate={rate}
        />
      ))}
    </div>
  );
}
