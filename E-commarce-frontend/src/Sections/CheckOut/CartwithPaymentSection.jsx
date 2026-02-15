// import PaymentMethod from "../../../components/genericComponents/PaymentMethod";
import PaymentMethod from "../PaymentMethod";
import CartTotals from "../../../components/genericComponents/CartTotals";
import { useCheckoutStore } from "../../zustand_checkout/checkoutStore";
export default function CartwithPaymentSection() {
  const cart = useCheckoutStore((state) => state.CartInfo);
  
  return (
    <div className="w-full flex flex-col gap-10 items-start justify-evenly">
      <CartTotals Items={cart.items} TotalItems={cart.totalItems} total={cart.totalPrice} className={"w-full"} />
      {/* Payment methods */}
      <div className="w-full">
        <PaymentMethod />
      </div>
    </div>
  );
}
