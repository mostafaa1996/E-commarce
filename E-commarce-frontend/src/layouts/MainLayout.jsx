import { Outlet } from "react-router-dom";
import Header from "@/components/Landing/Header";
import Footer from "@/components/Landing/Footer";
import Breadcrumbs from "@/components/genericComponents/Breadcrumbs";
import { useMatches } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/APIs/CartService";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useAuthStore } from "@/zustand_auth/authStore";
import useLogoutAction from "@/hooks/useLogoutAction";
import {useShopSearchStore} from "@/zustand_ShopPage/shopSearchStore";

const links = [
  { to: "/home#hero", label: "Home" },
  { to: "/home#categories", label: "Categories" },
  { to: "/shop?onDeal=true", label: "Deals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function MainLayout() {
  useScrollTo();
  const matches = useMatches();
  const { isLoggedIn, user } = useAuthStore();
  const { searchValue , setShopSearchValue } = useShopSearchStore();
  const { Logout } = useLogoutAction();
  const currentMatch = matches[matches.length - 1];
  const items =
    typeof currentMatch?.handle?.breadcrumb === "function"
      ? currentMatch.handle.breadcrumb(currentMatch.data)
      : currentMatch?.handle?.items;
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
  const CartTotal = cart?.totalItems ?? 0;
  return (
    <>
      <Header
        items = {items}
        cartTotal={CartTotal}
        loggedIn={isLoggedIn}
        links={links}
        logoutAction={Logout}
        userLink={user?.role === "admin" ? "/profile/admin/dashboard" : "/profile"}
        searchValue={searchValue}
        setSearchValue={setShopSearchValue}
      />
      <Breadcrumbs items={items || [{ label: "Home", href: "/" }]} />
      <Outlet />
      <Footer />
    </>
  );
}
