import BillingDetailsSection from "@/Sections/CheckOut/BillingDetailsSection";
import CartwithPaymentSection from "@/Sections/CheckOut/CartwithPaymentSection";
import { useLoaderData } from "react-router-dom";
import TextArea from "@/components/genericComponents/TextArea";
import { useState } from "react";
import { useRef } from "react";
import CheckoutPaymentSection from "@/Sections/CheckOut/placeOrderButtonSection";
import StripeElementsWrapper from "@/components/genericComponents/stripeElementWrapper";
import { SetUpPaymentMethods } from "@/APIs/UserProfileService";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";
import { getCartData, getShippingDetails } from "@/APIs/checkoutService";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/genericComponents/Loading";
import { useEffect } from "react";

export default function CheckoutPage() {
  let content = null;
  const TimeRef = useRef(null);
  const initialData = useLoaderData();
  const [orderNotes, setOrderNotes] = useState("");
  const [shippingDetailsModified, setShippingDetailsModified] = useState(null);
  const { orderState } = useCheckoutStore();

  const { data: checkoutData, isLoading } = useQuery({
    queryKey: ["checkout"],
    queryFn: async () => {
      const { cart, VAT_shipping, message: cartMessage } = await getCartData();
      const { shippingDetails, message: shippingDetailsMessage } =
        await getShippingDetails();

      return {
        cart,
        shippingDetails,
        VAT_shipping,
        cartMessage,
        shippingDetailsMessage,
      };
    },
    initialData,
  });

  useEffect(() => {
  if (shippingDetailsModified === null && checkoutData?.shippingDetails) {
    setShippingDetailsModified(checkoutData.shippingDetails);
  }
}, [checkoutData?.shippingDetails , shippingDetailsModified]);

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

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center py-20">
        <Loading />
      </div>
    );
  }

  if (checkoutData) {
    content = (
      <div className="lg:flex lg:flex-row lg:items-start lg:justify-evenly flex flex-col gap-10 items-start my-20 ">
        <BillingDetailsSection
          shippingDetails={checkoutData.shippingDetails}
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
          {checkoutData.cartMessage === "Cart found" && checkoutData.cart && (
            <CartwithPaymentSection
              cart={checkoutData.cart}
              VAT_shipping={checkoutData.VAT_shipping}
            />
          )}
          {checkoutData.cartMessage !== "Cart found" && (
            <h2 className="text-[30px] font-extralight text-[#272727] tracking-wide">
              {checkoutData.cartMessage}
            </h2>
          )}
          {checkoutData.cartMessage === "Cart found" && (
            <StripeElementsWrapper
              open={orderState === "InProgress"}
              getClientSecret={SetUpPaymentMethods}
            >
              {(clientSecret) => (
                <CheckoutPaymentSection
                  cart={checkoutData.cart}
                  shippingDetailsModified={shippingDetailsModified}
                  orderNotes={orderNotes}
                />
              )}
            </StripeElementsWrapper>
          )}
        </div>
      </div>
    );
  }

  return <>{content}</>;
}
