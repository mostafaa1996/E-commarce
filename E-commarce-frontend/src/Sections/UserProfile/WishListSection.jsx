import ProductCard from "@/components/genericComponents/ProductCard_V";
import DashBoardTableHeader from "@/components/genericComponents/DashBoardTableHeader";
import DashBoardTable from "@/components/genericComponents/DashBoardTable";
import Icon from "@/system/icons/Icon";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
export default function WishListSection({ WishList }) {
  const { currency, locale } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  return (
    <DashBoardTable >
      <DashBoardTableHeader
        ButtonAction={() => console.log("View all")}
        HeaderText="WishList"
        HeaderIcon={
          <Icon name="wishlist" size={24} strokeWidth={1.5} variant="primary" />
        }
        ButtonContent={{ position: "right", text: "View all", icon: ">" }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-3">
        {WishList &&
          WishList.length > 0 &&
          WishList.map((product) => (
            <ProductCard
              key={product._id}
              image={product.images[0].url}
              title={product.title}
              price={format(product.price)}
              NavigationLink={`/shop/products/${product._id}`}
              variant={"ShowNameAndPrice"}
            />
          ))}
      </div>
    </DashBoardTable>
  );
}
