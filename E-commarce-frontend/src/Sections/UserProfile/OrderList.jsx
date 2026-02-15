import DashBoardItem from "../../../components/genericComponents/DashBoardItem";
import DashBoardTable from "../../../components/genericComponents/DashBoardTable";
import DashBoardTableHeader from "../../../components/genericComponents/DashBoardTableHeader";

export default function OrderHistoryList({ orders }) {
  return (
    <DashBoardTable className={`max-w-5xl`}>
      <DashBoardTableHeader
        HeaderText="Order History"
        HeaderIcon="🛒"
        ButtonAction={() => console.log("View all")}
        ButtonContent={{ position: "right", text: "View all", icon: ">" }}
      />
      {orders.map((order) => (
        <DashBoardItem key={order.id} order={order} />
      ))}
    </DashBoardTable>
  );
}
