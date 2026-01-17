import ProductCard from "../../components/genericComponents/ProductCard_V";
// import { products } from "../Data/Products";
import { useshopResponseStore } from "../ShopPageData/ShopResponseStore";

export default function ProductGrid() {
  const { shopResponse } = useshopResponseStore();
  const MainProducts = shopResponse.products.map((product) => product);
  console.log(MainProducts);
  return (
    <div className="max-w-6xl grid grid-cols-2 sm:grid-cols-3 gap-6">
      {MainProducts.map((product) => (
        <ProductCard
          key={product._id}
          image={product.images[0].url}
          title={product.title}
          price={product.price}
          // variant={product.variant}
        />
      ))}
    </div>
  );
}
