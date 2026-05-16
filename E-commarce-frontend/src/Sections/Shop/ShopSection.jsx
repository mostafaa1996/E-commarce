import CurrentRangeOfResults from "@/components/genericComponents/CurrentRangeOfResults";
import SideBarFilterSection from "../SideBarFilterSection";
import SortingSection from "../SortingSection";
import { useQuery } from "@tanstack/react-query";
import { getShopProducts } from "@/APIs/shopProductsService";
import Button from "@/components/genericComponents/Button";
import { defaultShopQuery } from "@/Data/ShopQuery";
import useURLQuery from "@/hooks/UrlQuery";
import Loading from "@/components/genericComponents/Loading";
import { Outlet, useNavigation } from "react-router-dom";

export default function ShopSection() {
  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultShopQuery);
  const navigation = useNavigation();
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["products", MainQuery],
    queryFn: () => getShopProducts(MainQuery),
    placeholderData: (previousData) => previousData,
  });
  const isShopRouteLoading =
    navigation.state !== "idle" &&
    navigation.location?.pathname.startsWith("/shop");

  if ((isLoading || isFetching) && !data) {
    return <Loading message="Loading shop" fullPage />;
  }

  if (error && !data) {
    return(
      <div className="min-h-[80vh] px-4 py-16">
        <div className="mx-auto max-w-5xl rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Failed to load products.</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative my-10 flex gap-10 mt-10 justify-center">
      {(isFetching || isShopRouteLoading) && (
        <div className="absolute inset-0 z-20 flex items-start justify-center bg-white/60 pt-20 backdrop-blur-[1px]">
          <Loading message="Updating shop" />
        </div>
      )}
      <div className="w-[60%] mt-10 flex flex-col justify-start gap-10">
        <div className="max-w-8xl flex items-center justify-between">
          <div className="flex items-center gap-5">
            <CurrentRangeOfResults
              from={
                data?.pagination?.currentPage * MainQuery.limit -
                MainQuery.limit +
                1
              }
              to={data?.pagination?.currentPage * MainQuery.limit}
              total={data?.pagination?.totalItems}
            />
            {MainQuery.category && (
              <Button onClick={() => resetUrlQuery(defaultShopQuery)}>
                Clear filter
              </Button>
            )}
          </div>
          {MainQuery.category && <SortingSection />}
        </div>
        <Outlet
          context={{
            data,
            error,
            MainQuery,
            updateUrlQuery,
          }}
        />
      </div>
      <aside className="w-[25%] mt-10 ml-10 flex flex-col gap-10">
        <SideBarFilterSection data={data} />
      </aside>
    </div>
  );
}
