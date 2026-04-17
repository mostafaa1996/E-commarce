import DashBoardItem from "@/components/genericComponents/DashBoardItem";
import DashBoardTable from "@/components/genericComponents/DashBoardTable";
import DashBoardTableHeader from "@/components/genericComponents/DashBoardTableHeader";
import Icon from "@/system/icons/Icon";
import { useNavigate } from "react-router-dom";

export default function OrderHistoryList({ orders }) {
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
          <DashBoardItem
            key={order?._id}
            items={order?.orderItems || []}
            orderId={order?._id || ""}
            status={order?.Status?.status || ""}
            createdAt={order?.createdAt || ""}
            totalPrice={order?.totalPrice || 0}
          />
        ))}
    </DashBoardTable>
  );
}
