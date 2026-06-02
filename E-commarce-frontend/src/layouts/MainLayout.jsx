import { Outlet } from "react-router-dom";
import Header from "@/components/Landing/Header";
import Footer from "@/components/Landing/Footer";
import Breadcrumbs from "@/components/genericComponents/Breadcrumbs";
import { useMatches } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/APIs/CartService";
import {useScrollTo} from "@/hooks/useScrollTo";

export default function MainLayout() {
  useScrollTo();
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const items =
    typeof currentMatch?.handle?.breadcrumb === "function"
      ? currentMatch.handle.breadcrumb(currentMatch.data)
      : currentMatch?.handle?.items;
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
  const CartTotal = cart?.totalItems??0;
  return (
    <>
      <Header cartTotal={CartTotal} />
      <Breadcrumbs items={items || [{ label: "Home", href: "/" }]} />
      <Outlet />
      <Footer />
    </>
  );
}
