import { getUserOrders } from "@/APIs/UserProfileService";
import useCurrency from "@/hooks/CurrencyChange";
import useURLQuery from "@/hooks/UrlQuery";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const defaultQuery = {
  page: 1,
  limit: 5,
  search: "",
  status: "All",
};

export default function useOrdersForUserProfile() {
  const { MainQuery, updateUrlQuery, resetUrlQuery } =
    useURLQuery(defaultQuery);
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;

  const [search, setSearch] = useState(MainQuery.search);
  const ordersQuery = useQuery({
    queryKey: ["profile-orders", MainQuery],
    queryFn: () => getUserOrders(MainQuery),
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (search === MainQuery.search) {
      return;
    }

    const timeout = setTimeout(() => {
      updateUrlQuery({ search });
    }, 500);

    return () => clearTimeout(timeout);
  }, [MainQuery.search, search, updateUrlQuery]);

  function setFilter(value) {
    const v = value.toLowerCase();
    if (v === "all") {
      resetUrlQuery(defaultQuery);
      return;
    }

    updateUrlQuery({ status: v });
  }

  function getStatusColor(status) {
    return ordersQuery?.data?.statusStyles[status] || "bg-zinc-200 text-black";
  }

  function getPaymentStatusColor(paymentStatus) {
    return (
      ordersQuery?.data?.paymentStatusStyles[paymentStatus] ||
      "bg-zinc-200 text-black"
    );
  }

  function formatPrice(totalPrice) {
    return format(totalPrice * rate);
  }

  function createTabs(data) {
    const statusTabs = data?.map((status) =>
      typeof status === "string" ? status.toUpperCase() : status,
    );

    return ["ALL", ...(statusTabs || [])];
  }

  return {
    data: ordersQuery.data,
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    tabs: ordersQuery.data ? createTabs(ordersQuery?.data?.statusEnum) : [],
    activeFilter:
      typeof MainQuery.status === "string"
        ? MainQuery.status.toUpperCase()
        : MainQuery.status,
    setFilter,
    setSearch,
    getStatusColor,
    getPaymentStatusColor,
    formatPrice,
    updateUrlQuery,
  };
}
