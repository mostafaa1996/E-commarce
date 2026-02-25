import OrderSearchAndFilteration from "@/Sections/UserProfile/OrderRoute/OrderSearchAndFilteration.jsx";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import DashBoardItem from "@/components/genericComponents/DashBoardItem";
import DashBoardTable from "@/components/genericComponents/DashBoardTable";
import Pagination from "@/components/genericComponents/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserPaginatedOrders } from "@/APIs/UserProfileService";
export default function UserOrdersPage({ orders, NumberOfOrders }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile-orders"],
    queryFn: () => getUserPaginatedOrders(page, 5),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile found</p>;

  return (
    <BaseSection>
      <div className="flex flex-col items-center justify-center">
        <UserNestedRoutesHeader
          className="w-full"
          iconName="orders"
          title="My Orders"
          info={`${NumberOfOrders} orders`}
        />
        <OrderSearchAndFilteration className="w-full" />
        <div className="flex flex-col gap-0">
          <DashBoardTable className={`max-w-5xl my-4`}>
            {data.orders &&
              data.orders.length > 0 &&
              data.orders.map((order) => (
                <DashBoardItem
                  key={order._id}
                  items={order.orderItems}
                  orderId={order._id}
                  status={order.Status.status}
                  createdAt={order.createdAt}
                  totalPrice={order.totalPrice}
                />
              ))}
          </DashBoardTable>
        </div>
        <Pagination
          totalPages={NumberOfOrders}
          RangeOfPagesNumberToShow={5}
          currentPage={page}
          onChange={setPage}
        />
      </div>
    </BaseSection>
  );
}
