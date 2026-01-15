import ProductGrid from "../../../components/genericComponents/ProductGrid";
import Pagination from "../../../components/genericComponents/Pagination";
import CurrentRangeOfResults from "../../../components/genericComponents/CurrentRangeOfResults";
import SideBarFilterSection from "../SideBarFilterSection";
import SortingSection from "../SortingSection";
import SearchSection from "../SearchSection";
import { useShopQueryStore } from "../../ShopQueryStore";

export default function ShopSection() {
  const { shopQuery , setShopQuery } = useShopQueryStore();
  function setCurrentPageEvent(currentPage){
    setShopQuery("page", currentPage);
  }
  return (
    <div className="my-10 flex gap-10 mt-10 justify-center">
      <div className="mt-10 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <CurrentRangeOfResults
            from={(shopQuery.page * shopQuery.limit) - shopQuery.limit + 1}
            to={shopQuery.page * shopQuery.limit}
            total={100}
          />
          <SortingSection />
        </div>
        <div className="flex flex-col items-center justify-center gap-10">
          <ProductGrid />
          <Pagination
            totalPages={10}
            onChange={setCurrentPageEvent}
            RangeOfPagesNumberToShow={4}
          />
        </div>
      </div>
      <aside className="mt-10 ml-10 w-full lg:w-[310px] flex flex-col gap-10">
        <SearchSection />
        <SideBarFilterSection />
      </aside>
    </div>
  );
}
