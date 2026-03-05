import ProductCard from "@/components/genericComponents/ProductCard_V";
import useCurrency from "@/hooks/CurrencyChange";

export default function ProductGrid({ products }) {
  const MainProducts = products.map((product) => product);
  const format = useCurrency("USD", "en-US");
  return (
    <div className="max-w-6xl grid grid-cols-2 sm:grid-cols-3 gap-6">
      {MainProducts.map((product) => (
        <ProductCard
          key={product._id}
          image={product.images[0].url}
          title={product.title}
          price={product.price}
          NavigationLink={`/shop/products/${product._id}`}
          // variant={product.variant}
        />
      ))}
    </div>
  );
}
