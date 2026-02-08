import PaymentMethod from "../../../components/genericComponents/PaymentMethod";
import CartTotals from "../../../components/genericComponents/CartTotals";
import React from "react";
import { useCheckoutStore } from "../../zustand_checkout/checkoutStore";
export default function CartwithPaymentSection() {
  const cart = useCheckoutStore((state) => state.CartInfo);
  const setPayment = useCheckoutStore((state)=>state.setPaymentMethod);
  const payment = useCheckoutStore((state)=>state.PaymentMethod);
  return (
    <div className="mr-40 w-[65%] justify-self-center">
      <CartTotals TotalItems={cart.totalItems} total={cart.totalPrice}  />
      {/* Payment methods */}
      <div className="flex flex-col gap-3 mt-6">
        <PaymentMethod
          label="Direct bank transfer"
          value="bank"
          name = "bank"
          checked={payment === "bank"}
          onChange={() => setPayment("bank")}
        />

        <PaymentMethod
          label="Cash on delivery"
          value="cash"
          name = "cash"
          checked={payment === "cash"}
          onChange={() => setPayment("cash")}
        />

        <PaymentMethod
          label="PayPal"
          value="paypal"
          name = "paypal"
          checked={payment === "paypal"}
          onChange={() => setPayment("paypal")}
        />
      </div>

    </div>
  );
}
