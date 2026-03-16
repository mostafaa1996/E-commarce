import BillingDetailsSection from "@/Sections/CheckOut/BillingDetailsSection";
import CartwithPaymentSection from "@/Sections/CheckOut/CartwithPaymentSection";
import { useLoaderData } from "react-router-dom";
import TextArea from "@/components/genericComponents/TextArea";
import { useState } from "react";
import { useRef } from "react";
import CheckoutPaymentSection from "@/Sections/CheckOut/placeOrderButtonSection";
import StripeElementsWrapper from "@/components/genericComponents/stripeElementWrapper";
import {SetUpPaymentMethods} from "@/APIs/UserProfileService";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";

export default function CheckoutPage() {
  const TimeRef = useRef(null);
  const { cart, shippingDetails, VAT_shipping } = useLoaderData();
  const [orderNotes, setOrderNotes] = useState("");
  const [shippingDetailsModified, setShippingDetailsModified] =
    useState(shippingDetails);
  const { orderState } = useCheckoutStore();

  function setNotes(e) {
    setOrderNotes(e.target.value);
  }
  function onChangeShippingDetails(e) {
    if (TimeRef.current) clearTimeout(TimeRef.current);
    TimeRef.current = setTimeout(() => {
      setShippingDetailsModified((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }, 500);
  }

  return (
    <div className="lg:flex lg:flex-row lg:items-start lg:justify-evenly flex flex-col gap-10 items-start my-20 ">
      <BillingDetailsSection
        shippingDetails={shippingDetails}
        onChange={onChangeShippingDetails}
      />
      <div className="flex flex-col gap-10 max-w-2xl lg:w-[60%] w-[80%] m-5">
        {/* Additional information */}
        <div className="flex flex-col gap-6">
          <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
            ADDITIONAL INFORMATION
          </h2>
          <TextArea
            placeholder="Notes about your order. Like special notes for delivery."
            onChange={setNotes}
            name="notes"
          />
        </div>
        <CartwithPaymentSection cart={cart} VAT_shipping={VAT_shipping} />
        <StripeElementsWrapper
          open={orderState === "InProgress"}
          getClientSecret={SetUpPaymentMethods}
        >
          {(clientSecret) => (
            <CheckoutPaymentSection
              cart={cart}
              shippingDetailsModified={shippingDetailsModified}
              orderNotes={orderNotes}
            />
          )}
        </StripeElementsWrapper>
      </div>
    </div>
  );
}
