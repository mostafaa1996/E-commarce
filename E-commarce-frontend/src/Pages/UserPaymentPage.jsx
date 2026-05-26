import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import PaymentCard from "@/Sections/UserProfile/PaymentCard";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import EditPaymentForm from "@/Sections/UserProfile/EditPaymentForm";
import StripeElementsWrapper from "@/components/genericComponents/stripeElementWrapper";
import { SetUpPaymentMethods } from "@/APIs/UserProfileService";
import { Fragment } from "react";
import ProfilePageState from "@/components/genericComponents/ProfilePageState";
import useUserPaymentPage from "@/hooks/useUserPaymentPage";

export default function UserPaymentPage() {
  const {
    loadedCards,
    isLoading,
    error,
    isAdding,
    hasCards,
    shouldUseGrid,
    headerInfo,
    handleAdd,
    handleCancel,
    handleSetAsDefault,
    handleDelete,
  } = useUserPaymentPage();

  let content = null;

  if (isLoading) {
    content = (
      <ProfilePageState type="loading" loadingMessage="Loading payments" />
    );
  }
  if (error) {
    content = (
      <ProfilePageState
        type="error"
        title="Error loading payment methods"
        message={error.message}
      />
    );
  }
  if (!hasCards && !isLoading && !error) {
    content = (
      <ProfilePageState
        title="No payment methods"
        message="Add a payment method to speed up checkout."
      />
    );
  }
  if (hasCards) {
    content = loadedCards.map((card) => (
      <Fragment key={card.id}>
        <PaymentCard
          type={card.brand}
          isDefault={card.isDefault}
          name={card.name}
          cardNumber={card.last4}
          expires={card.exp_month + "/" + card.exp_year}
          setDefault={() => {
            handleSetAsDefault(card.id);
          }}
          deleteCard={() => {
            handleDelete(card.id);
          }}
        />
      </Fragment>
    ));
  }

  return (
    <BaseSection>
      <UserNestedRoutesHeader
        iconName="payment"
        title="My Payments"
        info={headerInfo}
        buttonIconName="plus"
        buttonText="Add Payment"
        onClick={handleAdd}
      />
      <StripeElementsWrapper
        open={isAdding}
        getClientSecret={SetUpPaymentMethods}
      >
        {(clientSecret) => (
          <EditPaymentForm
            title="Add Payment Method"
            clientSecret={clientSecret}
            onCancel={handleCancel}
          />
        )}
      </StripeElementsWrapper>
      <div
        className={`${
          !shouldUseGrid
            ? ""
            : "grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-10"
        }`}
      >
        {content}
      </div>
    </BaseSection>
  );
}
