
import CurrentRangeOfResults from "@/components/genericComponents/CurrentRangeOfResults";
import SideBarFilterSection from "../SideBarFilterSection";
import SortingSection from "../SortingSection";
import SearchSection from "../SearchSection";
import { useShopQueryStore } from "@/zustand_ShopPage/ShopQueryStore";
import { useQuery } from "@tanstack/react-query";
import { getShopProducts } from "@/APIs/shopProductsService";

export default function ShopSection({children}) {
  const { shopQuery} = useShopQueryStore();
  const { data , isLoading , error } = useQuery({
    queryKey: ["products", shopQuery],
    queryFn: () => getShopProducts(shopQuery),
  });

  return (
    <div className="my-10 flex gap-10 mt-10 justify-center">
      <div className="w-[60%] mt-10 flex flex-col justify-center gap-10">
        <div className="max-w-8xl flex items-center justify-between">
          <CurrentRangeOfResults
            from={
              data?.pagination?.currentPage * shopQuery.limit -
              shopQuery.limit +
              1
            }
            to={data?.pagination?.currentPage * shopQuery.limit}
            total={data?.pagination?.totalItems}
          />
          <SortingSection />
        </div>
        {children}
      </div>
      <aside className="w-[25%] mt-10 ml-10 flex flex-col gap-10">
        <SearchSection />
        <SideBarFilterSection products={data} />
      </aside>
    </div>
  );
}
