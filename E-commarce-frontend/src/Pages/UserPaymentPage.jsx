import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import PaymentCard from "@/Sections/UserProfile/PaymentCard";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import { useState } from "react";
import EditPaymentForm from "@/Sections/UserProfile/EditPaymentForm";
export default function UserPaymentPage({}) {
  const [isAdding, setIsAdding] = useState(false);

  function handleAdd() {
    setIsAdding(true);
  }
  return (
    <BaseSection>
      <UserNestedRoutesHeader
        iconName="payment"
        title="My Payments"
        info="1 payment"
        buttonIconName="plus"
        buttonText="Add Payment"
        onClick={handleAdd}
      />
      {isAdding && <EditPaymentForm />}
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
