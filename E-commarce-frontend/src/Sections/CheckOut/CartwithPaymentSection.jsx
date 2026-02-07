import PaymentMethod from "../../../components/genericComponents/PaymentMethod";
import CartTotals from "../../../components/genericComponents/CartTotals";
import React from "react";
export default function CartwithPaymentSection({ subtotal, total }) {
  const [payment, setPayment] = React.useState("bank");

  return (
    <div className="mr-40 w-[65%] justify-self-center">
      <CartTotals subtotal={subtotal} total={total} />
      {/* Payment methods */}
      <div className="flex flex-col gap-3 mt-6">
        <PaymentMethod
          label="Direct bank transfer"
          value="bank"
          checked={payment === "bank"}
          onChange={() => setPayment("bank")}
        />

        <PaymentMethod
          label="Check payments"
          value="check"
          checked={payment === "check"}
          onChange={() => setPayment("check")}
        />

        <PaymentMethod
          label="Cash on delivery"
          value="cod"
          checked={payment === "cod"}
          onChange={() => setPayment("cod")}
        />

        <PaymentMethod
          label="PayPal"
          value="paypal"
          checked={payment === "paypal"}
          onChange={() => setPayment("paypal")}
        />
      </div>

    </div>
  );
}
