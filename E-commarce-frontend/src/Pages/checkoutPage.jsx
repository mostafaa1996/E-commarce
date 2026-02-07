import TopFixedLayer from "../Sections/TopLayer/TopFixedLayer";
import BottomLayer from "../Sections/BottomLayer/BottomLayer";
import BillingDetailsSection from "../Sections/CheckOut/BillingDetailsSection";
import CartwithPaymentSection from "../Sections/CheckOut/CartwithPaymentSection";
import Button from "../../components/genericComponents/Button";
import { Form, useActionData } from "react-router-dom";
export default function CheckoutPage() {
  const actionData = useActionData();
  return (
    <>
      <TopFixedLayer Title="checkout" />
      <Form method="post">
        <BillingDetailsSection />
        <CartwithPaymentSection subtotal={100} total={100.0} />
        <div className="my-10 mr-40 w-[65%] justify-self-center">
          <Button className="mt-8 w-fit tracking-widest">PLACE AN ORDER</Button>
        </div>
      </Form>
      <BottomLayer />
    </>
  );
}
