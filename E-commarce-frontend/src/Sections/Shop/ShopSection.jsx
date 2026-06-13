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
import {useShopSearchStore} from "@/zustand_ShopPage/shopSearchStore";
import { useEffect } from "react";

export default function ShopSection() {
  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultShopQuery);
  const navigation = useNavigation();
  const { searchValue } = useShopSearchStore();
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["products", MainQuery],
    queryFn: () => getShopProducts(MainQuery),
    placeholderData: (previousData) => previousData,
  });
  const isShopRouteLoading =
    navigation.state !== "idle" &&
    navigation.location?.pathname.startsWith("/shop");

useEffect(() => {
  if (!searchValue) return;
  if (MainQuery.search === searchValue) return;
  const timeoutId = setTimeout(() => {
    if (MainQuery.search !== searchValue) {
      updateUrlQuery({ search: searchValue });
    }
  }, 400);

  return () => clearTimeout(timeoutId);
}, [searchValue, MainQuery.search, updateUrlQuery]);

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
    <div className="relative mx-auto my-6 flex w-full max-w-7xl flex-col gap-6 px-4 lg:my-10 lg:flex-row lg:justify-center lg:gap-10 lg:px-6">
      {(isFetching || isShopRouteLoading) && (
        <div className="absolute inset-0 z-20 flex items-start justify-center bg-white/60 pt-20 backdrop-blur-[1px]">
          <Loading message="Updating shop" />
        </div>
      )}
      <div className="mt-4 flex w-full min-w-0 flex-col justify-start gap-6 lg:mt-10 lg:w-[60%] lg:gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
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
      <aside className="mt-2 flex w-full flex-col gap-6 lg:mt-10 lg:ml-4 lg:w-[25%] lg:gap-10">
        <SideBarFilterSection data={data} />
      </aside>
    </div>
  );
}
