// import PaymentMethod from "../../../components/genericComponents/PaymentMethod";
import PaymentMethod from "../PaymentMethod";
import CartTotals from "@/components/genericComponents/CartTotals";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";
import OrderFeedBack from "@/components/genericComponents/OrderFeedBack";
import { useNavigate } from "react-router-dom";
import {OrderStatesUIData} from "@/system/Data/OrderStatesUIData";
export default function CartwithPaymentSection({ cart, VAT_shipping }) {
  // console.log(cart);
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const { orderState , orderId } = useCheckoutStore();
  const navigate = useNavigate();
  function okHandler() {
   navigate("/shop");
  }
  return (
    <div className="w-full flex flex-col gap-10 items-start justify-evenly">
      <CartTotals
        Items={cart.items}
        TotalItems={cart.totalItems}
        total={cart.totalPrice}
        className={"w-full"}
        VAT={VAT_shipping.VAT}
        shipping={VAT_shipping.shipping}
        format={format}
        rate={rate}
      />
      {/* Payment methods */}
      <div className="w-full">
        {orderState === "InProgress" && <PaymentMethod />}
        {orderState !== "InProgress" && (
          <OrderFeedBack
            orderId={orderId}
            IconName={
              OrderStatesUIData.find((state) => state.state === orderState).IconName
            }
            header={
              OrderStatesUIData.find((state) => state.state === orderState).header
            }
            message={
              OrderStatesUIData.find((state) => state.state === orderState).message
            }
            okHandler={okHandler}
          />
        )}
      </div>
    </div>
  );
}
