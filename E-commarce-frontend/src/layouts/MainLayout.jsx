import { Outlet } from "react-router-dom";
import Header from "@/components/Landing/Header";
import Footer from "@/components/Landing/Footer";
import Breadcrumbs from "@/components/genericComponents/Breadcrumbs";
import { useMatches } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/APIs/CartService";
import { useState } from "react";

export default function MainLayout() {
  const matches = useMatches();
  const items = matches[matches.length - 1]?.handle?.items;
  const [CartTotal, setCartTotal] = useState(null);
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
  if (cart && CartTotal === null) setCartTotal(cart?.totalItems);
  return (
    <>
      <Header cartTotal={CartTotal} />
      <Breadcrumbs items={items || [{ label: "Home", href: "/" }]} />
      <Outlet />
      <Footer />
    </>
  );
}
