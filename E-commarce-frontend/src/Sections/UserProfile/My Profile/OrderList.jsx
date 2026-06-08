import OrderItem from "@/components/genericComponents/OrderItem";
import DashBoardTable from "@/components/genericComponents/DashBoardTable";
import DashBoardTableHeader from "@/components/genericComponents/DashBoardTableHeader";
import Icon from "@/system/icons/Icon";
import { useNavigate } from "react-router-dom";

export default function OrderHistoryList({ orders , getStatusColor, getPaymentStatusColor, formatPrice}) {
  const navigate = useNavigate();
  return (
    <DashBoardTable className={`w-full`}>
      <DashBoardTableHeader
        HeaderText="Order History"
        HeaderIcon={
          <Icon name="orders" size={24} strokeWidth={1.5} variant="primary" />
        }
        ButtonAction={() => navigate("/profile/orders")}
        ButtonContent={{ position: "right", text: "View all", icon: ">" }}
      />
      {orders &&
        orders.length > 0 &&
        orders.map((order) => (
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
        ))}
    </DashBoardTable>
  );
}
