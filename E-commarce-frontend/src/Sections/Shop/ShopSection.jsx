import ProductGrid from "../../../components/genericComponents/ProductGrid";
import Pagination from "../../../components/genericComponents/Pagination";
import SearchBar from "../../../components/genericComponents/SearchBox";
import CurrentRangeOfResults from "../../../components/genericComponents/CurrentRangeOfResults";
import SideBarFilterSection from "../SideBarFilterSection";
import ProductsSortingOption from "../../../components/genericComponents/ProductsSortingOption";

export default function ShopSection() {
  function ShowFilterMenu() {
    console.log("ShowFilterMenu");
  }

  function SearchSuggestionsMenu() {
    console.log("ShowFilterMenu");
  }

  return (
    <div className="my-10 flex gap-10 mt-10 justify-center">
      <div className="mt-10 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <CurrentRangeOfResults from={1} to={10} total={100} />
          <ProductsSortingOption ShowFilterMenu={ShowFilterMenu} />
        </div>
        <div className="flex flex-col items-center justify-center gap-10">
          <ProductGrid />
          <Pagination
            current={1}
            totalPages={3}
            onChange={(page) => console.log(page)}
            RangeOfPagesNumberToShow={4}
          />
        </div>
      </div>
      <aside className="mt-10 ml-10 w-full lg:w-[310px] flex flex-col gap-10">
        <SearchBar />
        <SideBarFilterSection />
      </aside>
    </div>
  );
}
