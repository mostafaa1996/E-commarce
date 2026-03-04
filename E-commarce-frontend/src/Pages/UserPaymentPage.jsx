import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import PaymentCard from "@/Sections/UserProfile/PaymentCard";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import { useState , useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import EditPaymentForm from "@/Sections/UserProfile/EditPaymentForm";
import { getUserPaymentMethods } from "@/APIs/UserProfileService";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SetUpPaymentMethods } from "@/APIs/UserProfileService";

const stripePromise = loadStripe(
  "pk_test_51T71BH1fhq7FW9lm2LAqDDRqVTuhpseVzeliLcmZ4xkJ13m1wCcz1DZeIN16v3wkVbUEtem9KlZU5FUDNJpyzMbm00bRki0ZqO",
);
export default function UserPaymentPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const Cards = useLoaderData();
  const [DefaultCard, setDefaultCard] = useState(
    Cards.find((card) => card.isDefault),
  );

  useEffect(() => {
    SetUpPaymentMethods().then((res) => {
      console.log(res);
      setClientSecret(res.clientSecret);
    });
  }, []);

  // const {
  //   data: cards,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["profile-payments"],
  //   queryFn: getUserPaymentMethods,
  //   initialData: Cards,
  // });

  function handleAdd() {
    setIsAdding(true);
  }
  return (
    <BaseSection>
      <UserNestedRoutesHeader
        iconName="payment"
        title="My Payments"
        info={
          Cards.length > 0
            ? "You have " + Cards.length + " payment methods"
            : "You have no payment methods"
        }
        buttonIconName="plus"
        buttonText="Add Payment"
        onClick={handleAdd}
      />
      {isAdding && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret }}
          key={clientSecret}
        >
          <EditPaymentForm title="Add Payment Method" clientSecret={clientSecret} />
        </Elements>
      )}
      <PaymentCard
        type="Visa"
        isDefault={true}
        name="John Doe"
        cardNumber="•••• •••• •••• 4242"
        expires="08/27"
      />
    </BaseSection>
  );
}
