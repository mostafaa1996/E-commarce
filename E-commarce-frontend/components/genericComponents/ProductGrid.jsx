import ProductCard from "./ProductCard_V";
import { products } from "../../src/Data/Products";

export default function ProductGrid() {
  return (
    <div className="max-w-6xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          image={product.image}
          title={product.title}
          price={product.price}
          variant={product.variant}
        />
      ))}
    </div>
  );
}
