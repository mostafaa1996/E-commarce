import ProductCard from "@/components/genericComponents/ProductCard_V";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";

export default function ProductGrid({ products }) {
  const MainProducts = products.map((product) => product);
  const { currency, locale , conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1 ;
  return (
    <div className="max-w-6xl grid grid-cols-2 sm:grid-cols-3 gap-6">
      {MainProducts.map((product) => (
        <ProductCard
          key={product._id}
          image={product.images[0].url}
          title={product.title}
          price={format(product.price * rate)}
          NavigationLink={`/shop/products/${product._id}`}
          // variant={product.variant}
        />
      ))}
    </div>
  );
}
