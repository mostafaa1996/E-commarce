import ProductCard from "../../components/genericComponents/ProductCard_V";

export default function ProductGrid({products}) {
  const MainProducts = products.map((product) => product);
  return (
    <div className="max-w-6xl grid grid-cols-2 sm:grid-cols-3 gap-6">
      {MainProducts.map((product) => (
        <ProductCard
          key={product._id}
          image={product.images[0].url}
          title={product.title}
          price={product.price}
          NavigationLink={`/product/${product._id}`}
          // variant={product.variant}
        />
      ))}
    </div>
  );
}
