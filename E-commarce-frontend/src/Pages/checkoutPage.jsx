import TopFixedLayer from "../Sections/TopLayer/TopFixedLayer";
import BottomLayer from "../Sections/BottomLayer/BottomLayer";
import BillingDetailsSection from "../Sections/CheckOut/BillingDetailsSection";
import CartwithPaymentSection from "../Sections/CheckOut/CartwithPaymentSection";
export default function CheckoutPage() {
  return (
    <>
      <TopFixedLayer Title="checkout" />
      <BillingDetailsSection />
      <CartwithPaymentSection subtotal={100} total={100.0} />
      <BottomLayer />
    </>
  );
}