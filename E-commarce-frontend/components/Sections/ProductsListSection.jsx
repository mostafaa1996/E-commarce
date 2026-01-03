import ProductGrid from "../genericComponents/ProductGrid";
import CurrentRangeOfResults from "../genericComponents/CurrentRangeOfResults";
import SideBarFilterSection from "../Sections/SideBarFilterSection";

export default function ProductsListSection() {
  return (
    <div className="my-10 flex gap-10 mt-10 justify-center">
      <div className="mt-10 flex flex-col gap-10">
        <CurrentRangeOfResults />
        <ProductGrid />
      </div>
      <SideBarFilterSection />
    </div>
  );
}
