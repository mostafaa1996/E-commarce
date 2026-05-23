import OrderSearchAndFilteration from "@/Sections/UserProfile/OrderRoute/OrderSearchAndFilteration.jsx";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import OrderItem from "@/components/genericComponents/OrderItem";
import DashBoardTable from "@/components/genericComponents/DashBoardTable";
import Pagination from "@/components/genericComponents/Pagination";
import useOrdersForUserProfile from "@/hooks/useOrdersForUserProfile";

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
    formatOrderTotal,
    updateUrlQuery,
  } = useOrdersForUserProfile();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;
  if (!data) return <p>No profile found</p>;

  return (
    <BaseSection>
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
                  orderId={order?.orderId}
                  status={order?.status}
                  statusColor={getStatusColor(order?.status)}
                  createdAt={order?.createdAt}
                  totalPrice={formatOrderTotal(order?.totalPrice)}
                  itemsPrice={formatOrderTotal(order?.itemsPrice)}
                  taxPrice={formatOrderTotal(order?.taxPrice)}
                  shippingPrice={formatOrderTotal(order?.shippingPrice)}
                  paymentMethod={order?.paymentMethod}
                  paymentStatus={order?.paymentStatus}
                  paymentStatusColor={getPaymentStatusColor(
                    order?.paymentStatus,
                  )}
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
    </BaseSection>
  );
}
