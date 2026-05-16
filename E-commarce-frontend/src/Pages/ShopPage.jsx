import ProductGrid from "@/Sections/ProductGrid";
import Pagination from "@/components/genericComponents/Pagination";
import SetPaginationStart from "@/utils/SetPagination";
import { useOutletContext } from "react-router-dom";

const RangeOfPagesNumberToShow = 4;
export default function ShopPage() {
  const { data, MainQuery, updateUrlQuery } = useOutletContext();
  const startPage = data?.pagination
    ? SetPaginationStart(
        data.pagination.currentPage,
        data.pagination.totalPages,
        RangeOfPagesNumberToShow,
      )
    : 1;

  return (
    data && (
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center gap-10">
        {data.products?.length > 0 ? (
          <>
            <ProductGrid products={data.products} />
            <Pagination
              totalPages={data.pagination.totalPages}
              onChange={(page) => updateUrlQuery({ page })}
              startPage={startPage}
              currentPage={MainQuery.page}
              RangeOfPagesNumberToShow={RangeOfPagesNumberToShow}
            />
          </>
        ) : (
          <p className="text-center text-2xl font-semibold">
            No products found
          </p>
        )}
      </div>
    )
  );
}
