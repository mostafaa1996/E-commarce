import OrderSearchAndFilteration from "@/Sections/UserProfile/OrderRoute/OrderSearchAndFilteration.jsx";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import OrderItem from "@/components/genericComponents/OrderItem";
import DashBoardTable from "@/components/genericComponents/DashBoardTable";
import Pagination from "@/components/genericComponents/Pagination";
import useOrdersForUserProfile from "@/hooks/useOrdersForUserProfile";
import ProfilePageState from "@/components/genericComponents/ProfilePageState";

export default function UserOrdersPage() {
  const {
    data,
    isLoading,
    error,
    tabs,
    activeFilter,
    setFilter,
    setSearch,
    getStatusColor,
    getPaymentStatusColor,
    formatPrice,
    updateUrlQuery,
  } = useOrdersForUserProfile();

  if (isLoading) {
    return <ProfilePageState type="loading" loadingMessage="Loading orders" />;
  }

  if (error) {
    return (
      <ProfilePageState
        type="error"
        title="Error loading orders"
        message={error.message}
      />
    );
  }

  if (!data) {
    return (
      <ProfilePageState
        title="No orders found"
        message="Your order data is not available right now."
      />
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <UserNestedRoutesHeader
        className="w-full"
        iconName="orders"
        title="My Orders"
        info={`${data.orders.length} orders`}
      />
      <OrderSearchAndFilteration
        className="w-full"
        tabs={tabs}
        active={activeFilter}
        setActive={setFilter}
        setSearchValue={setSearch}
      />
      <div className="flex w-full flex-col gap-0">
        <DashBoardTable className="my-4 w-full">
          {data && data?.orders?.length > 0 ? (
            data?.orders?.map((order) => (
              <OrderItem
                key={order?._id}
                items={order?.orderItems}
                orderId={order?.orderNumber}
                status={order?.status}
                statusColor={getStatusColor(order?.status)}
                createdAt={order?.createdAt}
                updatedAt={order?.updatedAt}
                totalPrice={formatPrice(order?.totalPrice)}
                itemsPrice={formatPrice(order?.itemsPrice)}
                taxPrice={formatPrice(order?.taxPrice)}
                shippingPrice={formatPrice(order?.shippingPrice)}
                paymentMethod={order?.paymentMethod}
                paymentStatus={order?.paymentStatus}
                paymentStatusColor={getPaymentStatusColor(order?.paymentStatus)}
              />
            ))
          ) : (
            <p className="m-6 text-center sm:m-10">
              No orders found for this filter
            </p>
          )}
        </DashBoardTable>
      </div>
      <Pagination
        totalPages={
          data.orders.length <= 5 ? 1 : Math.ceil(data.orders.length / 5)
        }
        RangeOfPagesNumberToShow={5}
        currentPage={data?.pagination?.page}
        onChange={(page) => updateUrlQuery({ page })}
      />
    </div>
  );
}
