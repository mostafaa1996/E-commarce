import ProductDetails from "../Sections/ProductDetails";
import ProductTabs from "../Sections/ProductTabs";
import productDetails from "../Data/productDetails";
import TopFixedLayer from "../Sections/TopLayer/TopFixedLayer";
import BottomLayer from "../Sections/BottomLayer/BottomLayer";
import { product } from "../Data/product";
export default function ProductDetailsPage() {
  return (
    <>
      <TopFixedLayer Title="Product Details" />
      <ProductDetails product={productDetails} />
      <ProductTabs product={product} />
      <BottomLayer />
    </>
  );
}
