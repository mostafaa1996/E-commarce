import ProductDetails from "@/Sections/ProductDetails";
import ProductTabs from "@/Sections/ProductTabs";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/APIs/shopProductsService";
import { getUserWishlist } from "@/APIs/UserProfileService";
import { useLoaderData } from "react-router-dom";
export default function ProductDetailsPage() {
  const { id } = useParams();
  const { cart } = useLoaderData();
  let content = null;
  const {
    data: product,
    isLoading: isLoadingProduct,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
  const { data: wishlist, isLoading: isLoadingWishlist } = useQuery({
    queryKey: ["profile-wishlist"],
    queryFn: getUserWishlist,
  });

  if (isLoadingProduct || isLoadingWishlist) content = <p>Loading...</p>;
  if (error) content = <p>Failed to load product</p>;
  if (!product) content = <p>No product found</p>;
  if (product && wishlist) {
    const isInWishlist =
      wishlist?.wishlist.some(
        (item) => item._id.toString() === product._id.toString(),
      ) ?? false;
    content = (
      <>
        <ProductDetails
          product={product}
          initialValueFromUserWishlist={isInWishlist}
          intialQuantity={cart?.items.find((i) => i._id === product._id)?.quantity ?? 0}
        />
        <ProductTabs product={product} />
      </>
    );
  }

  return <>{content}</>;
}
