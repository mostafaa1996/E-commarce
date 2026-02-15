import TopFixedLayer from "../Sections/TopLayer/TopFixedLayer";
import BottomLayer from "../Sections/BottomLayer/BottomLayer";
import BillingDetailsSection from "../Sections/CheckOut/BillingDetailsSection";
import CartwithPaymentSection from "../Sections/CheckOut/CartwithPaymentSection";
import Button from "../../components/genericComponents/Button";
import { Form, useActionData } from "react-router-dom";
import TextArea from "../../components/genericComponents/TextArea";
import { useCheckoutStore } from "../zustand_checkout/checkoutStore";

export default function CheckoutPage() {
  const setOrderNotes = useCheckoutStore((state) => state.setOrderNotes);
  const currentState = useCheckoutStore((state) => state.currentState);
  const CardForm = useCheckoutStore((state) => state.CardForm);

  function isCardValid (card){
    console.log(JSON.stringify(card, null, 2));
    return (
      card?.cardNumber?.length === 16 &&
      card?.expiry?.match(/^\d{2}\/\d{2}$/) &&
      card?.cvc?.length === 3 &&
      card?.cardholderName?.trim().length > 0
    );
  }

  console.log(isCardValid(CardForm));

  function setNotes(e) {
    setOrderNotes(e.target.value);
  }
  return (
    <>
      <TopFixedLayer Title="checkout" />
      <Form
        action="/checkout"
        method="post"
        className="lg:flex lg:flex-row lg:items-start lg:justify-evenly flex flex-col gap-10 items-start my-20 "
      >
        <BillingDetailsSection />
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
          <CartwithPaymentSection />
          {currentState !== "OrderPlaced" && (
            <Button
              className="w-fit tracking-widest"
              type="submit"
              disabled={currentState === "fillForm" && !isCardValid(CardForm)}
            >
              PLACE AN ORDER
            </Button>
          )}
        </div>
      </Form>
      <BottomLayer />
    </>
  );
}
