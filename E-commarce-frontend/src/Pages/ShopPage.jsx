import TopFixedLayer from "../Sections/TopLayer/TopFixedLayer";
import BottomLayer from "../Sections/BottomLayer/BottomLayer";
import ShopSection from "../Sections/Shop/ShopSection";
export default function ShopPage() {
  return (
    <>
      <TopFixedLayer Title="Shop" />
      <ShopSection />
      <BottomLayer />
    </>
  );
}
