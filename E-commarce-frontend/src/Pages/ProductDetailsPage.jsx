import ProductDetails from "../Sections/ProductDetails";
import ProductTabs from "../Sections/ProductTabs";
import TopFixedLayer from "../Sections/TopLayer/TopFixedLayer";
import BottomLayer from "../Sections/BottomLayer/BottomLayer";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../APIs/shopProductsService";
export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById({ id }),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load product</p>;
  if (!data) return <p>No product found</p>;
  if (data) console.log(data);
  return (
    <>
      <TopFixedLayer Title="Product Details" />
      <ProductDetails product={data} />
      <ProductTabs product={data} />
      <BottomLayer />
    </>
  );
}
