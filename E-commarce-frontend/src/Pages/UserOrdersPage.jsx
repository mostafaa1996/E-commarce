import OrderSearchAndFilteration from "@/Sections/UserProfile/OrderRoute/OrderSearchAndFilteration.jsx";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import DashBoardItem from "@/components/genericComponents/DashBoardItem";
import DashBoardTable from "@/components/genericComponents/DashBoardTable";
import Pagination from "@/components/genericComponents/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserPaginatedOrders } from "@/APIs/UserProfileService";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";

const styles = {
  delivered: "bg-green-100 text-green-600",
  "In transit": "bg-yellow-100 text-yellow-600",
  cancelled: "bg-red-100 text-red-600",
  default: "bg-zinc-200 text-black",
  pending_Payment: "bg-red-200 text-red-600",
  returned: "bg-blue-100 text-red-600",
};

const tabs = [
  "All",
  "Delivered",
  "In Transit",
  "Cancelled",
  "Returned",
  "Pending_Payment",
];

export default function UserOrdersPage() {
  const [page, setPage] = useState(1);
  const [FilterAndSearch, setFilterAndSearch] = useState({
    filterValue: "All",
    searchValue: "",
  });
  let filteredOrders = [];
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile-orders" , page],
    queryFn: () => getUserPaginatedOrders(page, 5),
  });

  const { currency , locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1 ;

  filteredOrders = data?.orders
    ?.filter(
      (order) =>
        //filter on search only
        (FilterAndSearch.filterValue === "All" &&
        FilterAndSearch.searchValue !== ""
          ? order.orderItems.some((item) =>
              item.name
                .toLowerCase()
                .includes(FilterAndSearch.searchValue.toLowerCase()),
            ) ||
            order._id
              .toLowerCase()
              .includes(FilterAndSearch.searchValue.toLowerCase())
          : false) ||
        //filter on status including search
        (FilterAndSearch.filterValue !== "All" &&
        FilterAndSearch.searchValue !== ""
          ? (order.orderItems.some((item) =>
              item.name
                .toLowerCase()
                .includes(FilterAndSearch.searchValue.toLowerCase()),
            ) ||
              order._id
                .toLowerCase()
                .includes(FilterAndSearch.searchValue.toLowerCase())) &&
            order.Status.status.toLowerCase() ===
              FilterAndSearch.filterValue.toLowerCase()
          : false) ||
        //filter on status only
        (FilterAndSearch.filterValue !== "All" &&
          FilterAndSearch.searchValue === "" &&
          order.Status.status.toLowerCase() ===
            FilterAndSearch.filterValue.toLowerCase()) ||
        // No filter applied
        (FilterAndSearch.filterValue === "All" &&
          FilterAndSearch.searchValue === ""),
    )
    .map((order) => (
      <DashBoardItem
        key={order._id}
        items={order.orderItems}
        orderId={order._id}
        status={order.Status.status}
        statusColor={styles[order.Status.status] || styles.default}
        createdAt={order.createdAt}
        totalPrice={format(order.totalPrice * rate)}
      />
    ));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile found</p>;

  function setSearchValue(value) {
    setFilterAndSearch({ ...FilterAndSearch, searchValue: value });
  }
  function setFilter(value) {
    setFilterAndSearch({ ...FilterAndSearch, filterValue: value });
  }

  return (
    <BaseSection>
      <div className="flex flex-col items-center justify-center">
        <UserNestedRoutesHeader
          className="w-full"
          iconName="orders"
          title="My Orders"
          info={`${data.orders.length} orders`}
        />
        <OrderSearchAndFilteration
          className="w-full"
          tabs={tabs}
          active={FilterAndSearch.filterValue}
          setActive={setFilter}
          setSearchValue={setSearchValue}
        />
        <div className="flex flex-col gap-0 w-full">
          <DashBoardTable className={`w-full my-4`}>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => order)
            ) : (
              <p className="text-center m-10">No orders found for this filter</p>
            )}
          </DashBoardTable>
        </div>
        <Pagination
          totalPages={
            data.orders.length <= 5 ? 1 : Math.ceil(data.orders.length / 5)
          }
          RangeOfPagesNumberToShow={5}
          currentPage={page}
          onChange={setPage}
        />
      </div>
    </BaseSection>
  );
}
