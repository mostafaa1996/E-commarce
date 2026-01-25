const DevelopmentURL = "http://localhost:3000";
import { useProductDetailsQueryStore } from "../zustand_ProductDetails/ProductDetailsQuery";
export async function getProductDetails(ProductDetailsQuery) {
  let API_Link = "";
  const { setProductDetailsQuery } = useProductDetailsQueryStore();
  if (setProductDetailsQuery.AddToCartTrigger === true) {
    API_Link = `${DevelopmentURL}/cart?${new URLSearchParams(
      ProductDetailsQuery
    ).toString()}`;
  } else if (setProductDetailsQuery.OrderNowTrigger === true) {
    API_Link = `${DevelopmentURL}/checkout?${new URLSearchParams(
      ProductDetailsQuery
    ).toString()}`;
  }
  console.log(API_Link);
  const response = await fetch(API_Link, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load products");
  }
  return data;
}
