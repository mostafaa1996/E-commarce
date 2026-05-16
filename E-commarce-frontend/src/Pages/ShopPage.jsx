import ProductGrid from "@/Sections/ProductGrid";
import Pagination from "@/components/genericComponents/Pagination";
import { useQuery } from "@tanstack/react-query";
import { getShopProducts } from "@/APIs/shopProductsService";
import useShopQuery from "@/hooks/shopPageQuery";
import SetPaginationStart from "@/utils/SetPagination";
import Loading from "@/components/genericComponents/Loading";

const RangeOfPagesNumberToShow = 4;
export default function ShopPage() {
  let content = null;
  const { shopQuery, updateShopQuery } = useShopQuery();
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["products", shopQuery],
    queryFn: () => getShopProducts(shopQuery),
    placeholderData: (previousData) => previousData,
  });

  const startPage = data?.pagination
    ? SetPaginationStart(
        data.pagination.currentPage,
        data.pagination.totalPages,
        RangeOfPagesNumberToShow,
      )
    : 1;

  function setCurrentPageEvent(currentPage) {
    updateShopQuery({ page: currentPage });
  }

  if ((isLoading || isFetching) && !data) {
    content = <Loading message="Loading products" fullPage />;
  }

  if (error && !data) {
    content = (
      <div className="min-h-[80vh] px-4 py-16">
        <div className="mx-auto max-w-5xl rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load products.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (data) {
    content = (
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center gap-10">
        {data.products?.length > 0 ? (
          <>
            <ProductGrid products={data.products} />
            <Pagination
              totalPages={data.pagination.totalPages}
              onChange={setCurrentPageEvent}
              startPage={startPage}
              currentPage={shopQuery.page}
              RangeOfPagesNumberToShow={RangeOfPagesNumberToShow}
            />
          </>
        ) : (
          <p className="text-center text-2xl font-semibold">
            No products found
          </p>
        )}

        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Loading message="Updating products" />
          </div>
        )}
      </div>
    );
  }

  return <>{content}</>;
}
