import OrderSearchAndFilteration from "@/Sections/UserProfile/OrderRoute/OrderSearchAndFilteration.jsx";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
export default function UserOrdersPage({ orders, NumberOfOrders }) {
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
          {orders &&
            orders.length > 0 &&
            orders.map((order) => (
              <DashBoardItem
                key={order._id}
                items={order.orderItems}
                orderId={order._id}
                status={order.Status.status}
                createdAt={order.createdAt}
                totalPrice={order.totalPrice}
              />
            ))}
        </div>
      </div>
    </BaseSection>
  );
}
