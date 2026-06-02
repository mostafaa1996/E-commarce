import { createBrowserRouter } from "react-router-dom";
import { queryClient } from "./queryClient";
import { getShopProducts, getProductById } from "./APIs/shopProductsService";
import { loginAction, SignupAction, logoutAction } from "./APIs/AuthService";
import { getCart, getCartPage } from "@/APIs/CartService";
import { getCartData } from "./APIs/checkoutService";
import {
  getUserProfileData,
  getPersonalInfo,
  UpdatePersonalInfo,
  getUserWishlist,
  getUserAddresses,
  updateUserAddresses,
  changePassword,
} from "./APIs/UserProfileService";

import ShopPage from "./Pages/ShopPage";
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
import ShopPageLayout from "./layouts/shopPageLayout";
import { defaultShopQuery } from "./Data/shopQuery";
import { parseShopQueryFromUrl } from "./utils/ParseUrlQuery";
import StripeElementsWrapper from "./components/genericComponents/stripeElementWrapper";
import DashboardPage from "./Pages/AdminDashboardPage";
import AdminProductsPage from "./Pages/AdminProductsPage";
import AdminCategoriesPage from "./Pages/AdminCategoriesPage";
import AdminOrdersPage from "./Pages/AdminOrdersPage";
import AdminCustomersPage from "./Pages/AdminCustomersPage";
import AdminInventoryPage from "./Pages/AdminInventoryPage";
import AdminCouponsPage from "./Pages/AdminCouponsPage";
import AdminReviewsPage from "./Pages/AdminReviewsPage";
import AdminAnalyticsPage from "./Pages/AdminAnalyticsPage";
import AdminActivityPage from "./Pages/AdminActivityPage";
import AdminNotificationsPage from "./Pages/AdminNotificationsPage";
import AdminSettingsPage from "./Pages/AdminSettingsPage";
import ProductPage from "./Pages/ProductPage";
import HomePage from "./Pages/HomePage";
import ContactPage from "./Pages/ContactPage";
import AboutPage from "./Pages/AboutPage";
import { shortenText } from "./utils/utils";
import { useLoggedInEmail } from "./zustand_loggedIn/loggedInEmail";

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
            handle: { items: [{ label: "Shop", href: "/shop" }] },
            loader: async ({ request }) => {
              const InitialQuery = parseShopQueryFromUrl(
                request.url,
                defaultShopQuery,
              );
              return queryClient.ensureQueryData({
                queryKey: ["products", InitialQuery],
                queryFn: () => getShopProducts(InitialQuery),
              });
            },
          },
        ],
      },
      {
        path: "/shop/products/:id",
        element: <ProductPage />,
        handle: {
          breadcrumb: (data) => [
            { label: "Shop", href: "/shop" },
            {
              label:
                shortenText(data?.preloadedProduct?.title, 20) ||
                "Product Details",
            },
          ],
        },
        loader: async ({ params }) => {
          // console.log(params.id);
          // get the product
          const preloadedProduct = await queryClient.ensureQueryData({
            queryKey: ["product", params.id],
            queryFn: () => getProductById(params.id),
          });

          let cart = null;
          // get the cart to know if the product is in the cart or not and based on that start quantity from cart number
          if (useLoggedInEmail.getState().loggedInEmail) {
            cart = await queryClient.ensureQueryData({
              queryKey: ["cart"],
              queryFn: getCart,
            });
          }

          return { preloadedProduct, cart };
        },
      },
      {
        path: "/cart",
        element: <CartPage />,
        handle: { items: [{ label: "Cart", href: "/cart" }] },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["cart"],
            queryFn: getCartPage,
            staleTime: 1000 * 60 * 5,
          });
        },
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
        handle: { items: [{ label: "Checkout", href: "/checkout" }] },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["checkout"],
            queryFn: async () => {
              const { cart, message, blocked } = await getCartData();
              return {
                cart,
                message,
                blocked,
              };
            },
          });
        },
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
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
    ],
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/profile/admin/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/profile/admin/products",
    element: <AdminProductsPage />,
  },
  {
    path: "/profile/admin/categories",
    element: <AdminCategoriesPage />,
  },
  {
    path: "/profile/admin/orders",
    element: <AdminOrdersPage />,
  },
  {
    path: "/profile/admin/customers",
    element: <AdminCustomersPage />,
  },
  {
    path: "/profile/admin/inventory",
    element: <AdminInventoryPage />,
  },
  {
    path: "/profile/admin/coupons",
    element: <AdminCouponsPage />,
  },
  {
    path: "/profile/admin/reviews",
    element: <AdminReviewsPage />,
  },
  {
    path: "/profile/admin/analytics",
    element: <AdminAnalyticsPage />,
  },
  {
    path: "/profile/admin/activity",
    element: <AdminActivityPage />,
  },
  {
    path: "/profile/admin/notifications",
    element: <AdminNotificationsPage />,
  },
  {
    path: "/profile/admin/settings",
    element: <AdminSettingsPage />,
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
  {
    path: "/shop/cc",
    element: <ProductPage />,
    loader: async ({ params }) => {
      return null;
    },
  },
]);
