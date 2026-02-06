import { createBrowserRouter } from "react-router-dom";
import { queryClient } from "./queryClient";
import { getShopProducts, getProductById } from "./APIs/shopProductsService";
import { loginAction , SignupAction , logoutAction } from "./APIs/AuthService";
import { CartService } from "./APIs/CartService";


import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./Pages/CartPage";
import LoginPage from "./Pages/loginPage";
import SignupPage from "./Pages/SignupPage";

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
    element: <CartPage />,
    loader:  CartService
  },
  {
    path: "/checkout",
    element: <div>Checkout</div>,
  },
  {
    path: "/login",
    element: <LoginPage />,
    action: async ({ request }) => await loginAction({ request }),
  },
  {
    path: "/signup",
    element: <SignupPage />,
    action: async ({ request }) => await SignupAction({ request }),  
  },
  {
    path : "/logout" , 
    action : async () => await logoutAction()
  }
]);
