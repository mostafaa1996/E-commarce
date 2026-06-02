import ProductCard from "@/components/genericComponents/ProductCard_V";
import DashBoardTableHeader from "@/components/genericComponents/DashBoardTableHeader";
import DashBoardTable from "@/components/genericComponents/DashBoardTable";
import Icon from "@/system/icons/Icon";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import { useNavigate } from "react-router-dom";

export default function WishListSection({ WishList }) {
  const { currency, locale } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const navigate = useNavigate();
  return (
    <DashBoardTable>
      <DashBoardTableHeader
        ButtonAction={() => navigate("/profile/wishlist")}
        HeaderText="WishList"
        HeaderIcon={
          <Icon name="wishlist" size={24} strokeWidth={1.5} variant="primary" />
        }
        ButtonContent={{ position: "right", text: "View all", icon: ">" }}
      />
      <div className="grid grid-cols-1 justify-items-center gap-4 p-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {WishList &&
          WishList.length > 0 &&
          WishList.map((product) => (
            <ProductCard
              key={product?.productId}
              image={product?.image}
              title={product?.title}
              price={format(product?.price)}
              NavigationLink={`/shop/products/${product?.productId}?variantId=${product?.variantId}`}
              variant={"ShowNameAndPrice"}
            />
          ))}
      </div>
    </DashBoardTable>
  );
}
