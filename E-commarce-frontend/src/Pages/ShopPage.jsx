import ProductGrid from "@/Sections/ProductGrid";
import Pagination from "@/components/genericComponents/Pagination";
import { useQuery } from "@tanstack/react-query";
import { getShopProducts } from "@/APIs/shopProductsService";
import useShopQuery from "@/hooks/shopPageQuery";
import SetPaginationStart from "@/utils/SetPagination";

const RangeOfPagesNumberToShow = 4;
export default function ShopPage() {
  const { shopQuery, updateShopQuery } = useShopQuery();
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["products", shopQuery],
    queryFn: () => getShopProducts(shopQuery),
    placeholderData: (previousData) => previousData,
  });

  const startPage = SetPaginationStart(
    data.pagination.currentPage,
    data.pagination.totalPages,
    RangeOfPagesNumberToShow,
  );

  function setCurrentPageEvent(currentPage) {
    updateShopQuery({ page: currentPage });
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) return <p>Error loading products</p>;
  return (
    <div className="flex flex-col items-center justify-center gap-10 min-h-[80vh]">
      <ProductGrid products={data.products} />
      {data && data?.products?.length > 0 && (
        <Pagination
          totalPages={data.pagination.totalPages}
          onChange={setCurrentPageEvent}
          startPage={startPage}
          currentPage={shopQuery.page}
          RangeOfPagesNumberToShow={RangeOfPagesNumberToShow}
        />
      )}
      {(!data || (data && data?.products?.length === 0)) && (
        <p className="text-2xl text-center font-semibold">No products found</p>
      )}
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
