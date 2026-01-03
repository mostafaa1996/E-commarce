import ProductCard from "./ProductCard_V";
import { products } from "../../src/Data/Products";
import Pagination from "./Pagination";
export default function ProductGrid() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div
        className="
        max-w-6xl
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
        gap-6
      "
      >
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
      <Pagination
        current={1}
        totalPages={3}
        onChange={(page) => console.log(page)}
      />
    </div>
  );
}
