import { createBrowserRouter } from "react-router-dom";
import { queryClient } from "./queryClient";
import { getShopProducts, getProductById } from "./APIs/shopProductsService";

import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { defaultShopQuery } from "./zustand_ShopPage/shopDefaultQuery";

export const router = createBrowserRouter([
  {
    path: "/shop",
    element: <ShopPage />,
    loader: async () => {
      return queryClient.ensureQueryData({
        queryKey: ["products", defaultShopQuery],
        queryFn: () => getShopProducts(defaultShopQuery),
      });
    },
  },
  {
    path: "/shop/products/:id",
    element: <ProductDetailsPage />,
    loader: async ({ params }) => {
      console.log(params.id);
      return queryClient.ensureQueryData({
        queryKey: ["product", params.id],
        queryFn: () => getProductById(params.id),
      });
    },
  },
  {
    path: "/cart",
    element: <div>Cart</div>,
  },
  {
    path: "/checkout",
    element: <div>Checkout</div>,
  },
]);
