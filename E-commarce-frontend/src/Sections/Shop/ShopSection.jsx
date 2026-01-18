import ProductGrid from "../ProductGrid";
import Pagination from "../../../components/genericComponents/Pagination";
import CurrentRangeOfResults from "../../../components/genericComponents/CurrentRangeOfResults";
import SideBarFilterSection from "../SideBarFilterSection";
import SortingSection from "../SortingSection";
import SearchSection from "../SearchSection";
import { useShopQueryStore } from "../../ShopPageData/ShopQueryStore";
import { useshopResponseStore } from "../../ShopPageData/ShopResponseStore";
import { useQuery } from "@tanstack/react-query";
import {getShopProducts} from "../../Services/shopProductsService";
import { useEffect } from "react";

export default function ShopSection() {
  const { shopQuery, setShopQuery } = useShopQueryStore();
  const { shopResponse , setshopResponse } = useshopResponseStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", shopQuery],
    queryFn: () => getShopProducts(shopQuery),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      setshopResponse(data);
    }
  }, [data, setshopResponse]);

  function setCurrentPageEvent(currentPage) {
    setShopQuery("page", currentPage);
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;
  return (
    <div className="my-10 flex gap-10 mt-10 justify-center">
      <div className="mt-10 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <CurrentRangeOfResults
            from={
              shopResponse.currentPage * shopQuery.limit - shopQuery.limit + 1
            }
            to={shopResponse.currentPage * shopQuery.limit}
            total={shopResponse.totalItems}
          />
          <SortingSection />
        </div>
        <div className="flex flex-col items-center justify-center gap-10">
          <ProductGrid />
          <Pagination
            totalPages={shopResponse.totalPages}
            onChange={setCurrentPageEvent}
            currentPage={shopResponse.currentPage}
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
