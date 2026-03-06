import ProductGrid from "@/Sections/ProductGrid";
import Pagination from "@/components/genericComponents/Pagination";
import { useShopQueryStore } from "@/zustand_ShopPage/ShopQueryStore";
import { useQuery } from "@tanstack/react-query";
import { getShopProducts } from "@/APIs/shopProductsService";
export default function ShopPage() {
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
    <div className="flex flex-col items-center justify-center gap-10">
      <ProductGrid products={data.products} />
      <Pagination
        totalPages={data.pagination.totalPages}
        onChange={setCurrentPageEvent}
        currentPage={data.pagination.currentPage}
        RangeOfPagesNumberToShow={4}
      />
    </div>
  );
}
