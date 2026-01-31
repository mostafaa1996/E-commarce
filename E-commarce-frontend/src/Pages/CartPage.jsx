import TopFixedLayer from "../Sections/TopLayer/TopFixedLayer";
import BottomLayer from "../Sections/BottomLayer/BottomLayer";
import CartSection from "../Sections/Cart/CartSection";

export default function CartPage() {

  return (
    <>
      <TopFixedLayer Title="Cart" />
      <CartSection />
      <BottomLayer />
    </>
  );
}