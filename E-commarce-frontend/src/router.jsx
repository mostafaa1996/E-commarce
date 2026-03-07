import { createBrowserRouter } from "react-router-dom";
import { queryClient } from "./queryClient";
import { getShopProducts, getProductById } from "./APIs/shopProductsService";
import { loginAction, SignupAction, logoutAction } from "./APIs/AuthService";
import { CartService } from "./APIs/CartService";
import { checkoutLoader, checkoutAction } from "./APIs/checkoutService";
import {
  getUserProfileData,
  getPersonalInfo,
  UpdatePersonalInfo,
  getUserPaginatedOrders,
  getUserWishlist,
  getUserAddresses,
  updateUserAddresses,
  changePassword,
} from "./APIs/UserProfileService";

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
import MainLayout from "./layouts/MainLayout";

import { defaultShopQuery } from "./zustand_ShopPage/shopDefaultQuery";
import ShopPageLayout from "./layouts/shopPageLayout";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/shop",
        element: <ShopPageLayout />,
        children: [
          {
            index: true,
            element: <ShopPage />,
            handle: { title: "Shop" },
            loader: async () => {
              return queryClient.ensureQueryData({
                queryKey: ["products", defaultShopQuery],
                queryFn: () => getShopProducts(defaultShopQuery),
              });
            },
          },
        ],
      },
      {
        path: "/shop/products/:id",
        element: <ProductDetailsPage />,
        handle: { title: "Product Details" },
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
        handle: { title: "Cart" },
        loader: CartService,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
        handle: { title: "Checkout" },
        loader: checkoutLoader,
        action: checkoutAction,
      },
      {
        path: "/profile",
        element: <UserProfilePage />,
        handle: { title: "Profile" },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["profile"],
            queryFn: getUserProfileData,
            staleTime: 1000 * 60 * 5,
          });
        },
      },
      {
        path: "/profile/orders",
        element: <UserOrdersPage />,
        handle: { title: "profile > Orders" },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["profile-orders", 1],
            queryFn: () => getUserPaginatedOrders(1, 5),
            staleTime: 1000 * 60 * 5,
          });
        },
      },
      {
        path: "/profile/wishlist",
        element: <WishListPage />,
        handle: { title: "profile > WishList" },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["profile-wishlist"],
            queryFn: getUserWishlist,
            staleTime: 1000 * 60 * 5,
          });
        },
      },
      {
        path: "/profile/addresses",
        element: <UserAddressesPage />,
        handle: { title: "profile > Addresses" },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["profile-addresses"],
            queryFn: getUserAddresses,
          });
        },
        action: async ({ request }) => await updateUserAddresses(request),
      },
      {
        path: "/profile/payments",
        element: <UserPaymentPage />,
        handle: { title: "profile > Payments" },
      },
      {
        path: "/profile/settings",
        element: <UserSettingsPage />,
        handle: { title: "profile > Settings" },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["profile-settings"],
            queryFn: () => {
              return null;
            },
            staleTime: 1000 * 60 * 5,
          });
        },
        action: async ({ request }) => await changePassword(request),
      },
      {
        path: "/profile/edit-profile",
        element: <EditUserProfilePage />,
        handle: { title: "profile > Edit" },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["profile-edit"],
            queryFn: getPersonalInfo,
            staleTime: 1000 * 60 * 5,
          });
        },
        action: async ({ request }) => await UpdatePersonalInfo(request),
      },
    ],
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
    path: "/logout",
    action: async () => await logoutAction(),
  },
]);
