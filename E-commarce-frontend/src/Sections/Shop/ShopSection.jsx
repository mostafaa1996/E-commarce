
import CurrentRangeOfResults from "@/components/genericComponents/CurrentRangeOfResults";
import SideBarFilterSection from "../SideBarFilterSection";
import SortingSection from "../SortingSection";
import SearchSection from "../SearchSection";
import { useQuery } from "@tanstack/react-query";
import { getShopProducts } from "@/APIs/shopProductsService";
import Button from "@/components/genericComponents/Button";
import useShopQuery from "@/hooks/shopPageQuery";

export default function ShopSection({children}) {
  const {resetShopQuery , shopQuery } = useShopQuery();
  const { data , error } = useQuery({
    queryKey: ["products", shopQuery],
    queryFn: () => getShopProducts(shopQuery),
    placeholderData: (previousData) => previousData,
  });

  if (error) return <p>Error loading products</p>;

  return (
    <div className="my-10 flex gap-10 mt-10 justify-center">
      <div className="w-[60%] mt-10 flex flex-col justify-start gap-10">
        <div className="max-w-8xl flex items-center justify-between">
          <div className="flex items-center gap-5">
            <CurrentRangeOfResults
              from={
                data?.pagination?.currentPage * shopQuery.limit -
                shopQuery.limit +
                1
              }
              to={data?.pagination?.currentPage * shopQuery.limit}
              total={data?.pagination?.totalItems}
            />
            {shopQuery.category && <Button onClick={resetShopQuery}>Clear filter</Button>}
          </div>
          {shopQuery.category && <SortingSection />}
        </div>
        {children}
      </div>
      <aside className="w-[25%] mt-10 ml-10 flex flex-col gap-10">
        <SearchSection />
        <SideBarFilterSection data={data} />
      </aside>
    </div>
  );
}
