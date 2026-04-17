import { createBrowserRouter } from "react-router-dom";
import { queryClient } from "./queryClient";
import { getShopProducts, getProductById } from "./APIs/shopProductsService";
import { loginAction, SignupAction, logoutAction } from "./APIs/AuthService";
import { getCart } from "@/APIs/CartService";
import { getCartData, getShippingDetails } from "./APIs/checkoutService";
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
import ShopPageLayout from "./layouts/shopPageLayout";
import { parseShopQueryFromUrl } from "./utils/ParseShopQuery";
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
            loader: async ({ request }) => {
              const InitialQuery = parseShopQueryFromUrl(request.url);
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
        element: <ProductDetailsPage />,
        handle: { title: "Product Details" },
        loader: async ({ params }) => {
          // console.log(params.id);
          const product = await queryClient.ensureQueryData({
            queryKey: ["product", params.id],
            queryFn: () => getProductById(params.id),
          });

          const cart = await queryClient.ensureQueryData({
            queryKey: ["cart"],
            queryFn: getCart,
          });

          return { product, cart };
        },
      },
      {
        path: "/cart",
        element: <CartPage />,
        handle: { title: "Cart" },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["cart"],
            queryFn: getCart,
            staleTime: 1000 * 60 * 5,
          });
        },
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
        handle: { title: "Checkout" },
        loader: async () => {
          return queryClient.ensureQueryData({
            queryKey: ["checkout"],
            queryFn: async () => {
              const {
                cart,
                VAT_shipping,
                message: cartMessage,
              } = await getCartData();
              const { shippingDetails, message: shippingDetailsMessage } =
                await getShippingDetails();
              return {
                cart,
                shippingDetails,
                VAT_shipping,
                cartMessage,
                shippingDetailsMessage,
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
   element: <AdminCouponsPage/>,
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
]);
