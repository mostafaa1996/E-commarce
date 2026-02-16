import ProductCard from "../../../components/genericComponents/ProductCard_V";
import DashBoardTableHeader from "../../../components/genericComponents/DashBoardTableHeader";
import DashBoardTable from "../../../components/genericComponents/DashBoardTable";
import Icon from "../../system/icons/Icon";
export default function WishListSection({ WishList }) {
  return (
    <DashBoardTable className={`max-w-5xl`}>
      <DashBoardTableHeader
        ButtonAction={() => console.log("View all")}
        HeaderText="WishList"
        HeaderIcon={<Icon name="wishlist" size={24} strokeWidth={1.5} variant="primary" />}
        ButtonContent={{ position: "right", text: "View all", icon: ">" }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-3">
        {WishList.map((address) => (
          <ProductCard key={address.id}  />
        ))}
      </div>
    </DashBoardTable>
  );
}