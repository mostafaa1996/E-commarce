// import PaymentMethod from "../../../components/genericComponents/PaymentMethod";
import PaymentMethod from "../PaymentMethod";
import CartTotals from "../../../components/genericComponents/CartTotals";
import { useCheckoutStore } from "../../zustand_checkout/checkoutStore";
export default function CartwithPaymentSection() {
  const cart = useCheckoutStore((state) => state.CartInfo);
  const setPayment = useCheckoutStore((state)=>state.setPaymentMethod);
  const payment = useCheckoutStore((state)=>state.PaymentMethod);
  return (
    <div className="w-full flex flex-col gap-10 items-start justify-evenly">
      <CartTotals TotalItems={cart.totalItems} total={cart.totalPrice} className={"w-full"} />
      {/* Payment methods */}
      <div className="w-full">
        <PaymentMethod />
      </div>
    </div>
  );
}
