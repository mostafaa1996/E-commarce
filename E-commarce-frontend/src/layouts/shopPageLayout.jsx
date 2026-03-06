import ShopSection from "@/Sections/Shop/ShopSection";
import { Outlet } from "react-router-dom";

export default function ShopPageLayout() {
  return (
    <>
      <ShopSection>
        <Outlet />
      </ShopSection>
    </>
  );
}
