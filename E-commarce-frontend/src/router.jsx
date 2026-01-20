import { createBrowserRouter } from "react-router-dom";
import { queryClient } from "./queryClient";
import { getShopProducts } from "./services/shopProductsService";

import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { defaultShopQuery } from "./ShopPageData/shopDefaultQuery";

export const router = createBrowserRouter([
  {
    path: "/shop",
    element: <ShopPage />,
    loader: async () => {
      return queryClient.ensureQueryData({
        queryKey: [
          "products",
          defaultShopQuery,
        ],
        queryFn: () => getShopProducts(defaultShopQuery),
      });
    },
  },
  {
    path: "/products/:id",
    element: <ProductDetailsPage />,
  },
]);
