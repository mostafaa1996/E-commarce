import ProductGrid from "../ProductGrid";
import Pagination from "../../../components/genericComponents/Pagination";
import CurrentRangeOfResults from "../../../components/genericComponents/CurrentRangeOfResults";
import SideBarFilterSection from "../SideBarFilterSection";
import SortingSection from "../SortingSection";
import SearchSection from "../SearchSection";
import { useShopQueryStore } from "../../zustand_ShopPage/ShopQueryStore";
import { useQuery } from "@tanstack/react-query";
import { getShopProducts } from "../../APIs/shopProductsService";

export default function ShopSection() {
  const { shopQuery, setShopQuery } = useShopQueryStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", shopQuery],
    queryFn: () => getShopProducts(shopQuery),
  });

  function setCurrentPageEvent(currentPage) {
    setShopQuery("page", currentPage);
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;
  if (!data) return <p>No products found</p>;
  return (
    <div className="my-10 flex gap-10 mt-10 justify-center">
      <div className="mt-10 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <CurrentRangeOfResults
            from={
              data.pagination.currentPage * shopQuery.limit -
              shopQuery.limit +
              1
            }
            to={data.pagination.currentPage * shopQuery.limit}
            total={data.pagination.totalItems}
          />
          <SortingSection />
        </div>
        <div className="flex flex-col items-center justify-center gap-10">
          <ProductGrid products={data.products} />
          <Pagination
            totalPages={data.pagination.totalPages}
            onChange={setCurrentPageEvent}
            currentPage={data.pagination.currentPage}
            RangeOfPagesNumberToShow={4}
          />
        </div>
      </div>
      <aside className="mt-10 ml-10 w-full lg:w-[310px] flex flex-col gap-10">
        <SearchSection />
        <SideBarFilterSection products={data} />
      </aside>
    </div>
  );
}
