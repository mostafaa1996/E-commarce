import { createBrowserRouter } from "react-router-dom";
import { queryClient } from "./queryClient";
import { getShopProducts, getProductById } from "./APIs/shopProductsService";
import { loginAction , SignupAction , logoutAction } from "./APIs/AuthService";
import { CartService } from "./APIs/CartService";
import { checkoutLoader , checkoutAction } from "./APIs/checkoutService";
import { getUserProfileData , getPersonalInfo } from "./APIs/UserProfileService";


import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./Pages/CartPage";
import LoginPage from "./Pages/loginPage";
import SignupPage from "./Pages/SignupPage";
import CheckoutPage from "./Pages/checkoutPage";
import UserProfilePage from "./Pages/UserProfilePage";
import EditUserProfilePage from "./Pages/EditUserProfilePage";
import UserOrdersPage from "./Pages/UserOrdersPage";
import WishListPage from "./Pages/wishlistPage";
import UserAddressesPage from "./Pages/UserAddressesPage";
import UserPaymentPage from "./Pages/UserPaymentPage";
import UserSettingsPage from "./Pages/UserSettingsPage";

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
    element: <CheckoutPage />,
    loader: checkoutLoader,
    action: checkoutAction
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
  },
  {
    path: "/profile",
    element: <UserProfilePage />,
    loader: async () => {
      return queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getUserProfileData,
      });
    },
  },
  {
    path: "/profile/orders",
    element: <UserOrdersPage />,
    loader: async () => {
      return queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getUserProfileData,
      });
    },
  },
  {
    path: "/profile/wishlist",
    element: <WishListPage />,
    loader: async () => {
      return queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getUserProfileData,
      });
    },
  },
  {
    path: "/profile/addresses",
    element: <UserAddressesPage />,
    loader: async () => {
      return queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getUserProfileData,
      });
    },
  },
  {
    path: "/profile/payments",
    element: <UserPaymentPage />,
    loader: async () => {
      return queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getUserProfileData,
      });
    },
  },
  {
    path: "/profile/settings",
    element: <UserSettingsPage />,
    loader: async () => {
      return queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getUserProfileData,
      });
    },
  },
  {
    path: "/profile/edit-profile",
    element: <EditUserProfilePage />,
    loader: async () => {
      return queryClient.ensureQueryData({
        queryKey: ["profile"],
        queryFn: getPersonalInfo,
      });
    },
  }
]);
