import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import PaymentCard from "@/Sections/UserProfile/PaymentCard";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import EditPaymentForm from "@/Sections/UserProfile/EditPaymentForm";
import {
  getUserPaymentMethods,
  SetUpPaymentMethods,
  setCardAsDefault,
  deletePaymentMethod,
} from "@/APIs/UserProfileService";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Fragment } from "react";
import { queryClient } from "../queryClient";

const stripePromise = loadStripe(
  "pk_test_51T71BH1fhq7FW9lm2LAqDDRqVTuhpseVzeliLcmZ4xkJ13m1wCcz1DZeIN16v3wkVbUEtem9KlZU5FUDNJpyzMbm00bRki0ZqO",
);
export default function UserPaymentPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (isAdding) {
      SetUpPaymentMethods().then((data) => {
        setClientSecret(data.clientSecret);
      });
    }
  }, [isAdding, setClientSecret]);

  const {
    data: loadedCards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile-payments"],
    queryFn: getUserPaymentMethods,
  });

  const Modification = useMutation({
    mutationKey: ["profile-payments"],
    mutationFn: async (data) => {
      console.log(data.cardId, data.intent);
      if (data.intent === "delete") {
        console.log(data.cardId);
        return await deletePaymentMethod(data.cardId);
      } else if (data.intent === "setAsDefault") {
        return await setCardAsDefault(data.cardId);
      }
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["profile-payments"] });
      const previous = queryClient.getQueryData(["profile-payments"]);
      queryClient.setQueryData(["profile-payments"], (old) => {
        if (!old) return []; // if old is undefined, return an empty array as cashe is empty
        if (data.intent === "setAsDefault") {
          const cards = old.map((card) => {
            if (card.id === data.cardId) {
              return { ...card, isDefault: true };
            }
            return { ...card, isDefault: false };
          });
          return cards;
        }
        else if (data.intent === "delete") {
          const cards = old.filter((card) => card.id !== data.cardId);
          return cards;
        }
      });
      return { previous };
    },
    onError: (context) => {
      if (context?.previous) {
        queryClient.setQueryData(["profile-payments"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-payments"] });
    },
  });

  let content = null;

  function handleAdd() {
    setIsAdding(true);
  }
  function handleCancel() {
    setIsAdding(false);
  }

  function handleSetAsDefault(id) {
    Modification.mutate({cardId : id , intent : "setAsDefault"});
  }

  function handleDelete(id) {
    Modification.mutate({cardId : id , intent : "delete"});
  }

  if (isLoading) {
    content = <h1 className="text-center font-bold text-2xl">Loading...</h1>;
  }
  if (error) {
    content = (
      <h1 className="text-center font-bold text-2xl">{error.message}</h1>
    );
  }
  if (!loadedCards && !isLoading && !error) {
    content = (
      <h1 className="text-center font-bold text-2xl">
        You have no payment methods
      </h1>
    );
  }
  if (loadedCards && loadedCards.length > 0) {
    // console.log(loadedCards);
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
        info={
          loadedCards?.length > 0
            ? "You have " + loadedCards?.length + " payment methods"
            : "You have no payment methods"
        }
        buttonIconName="plus"
        buttonText="Add Payment"
        onClick={handleAdd}
      />
      {isAdding && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret }}
          key={clientSecret}
        >
          <EditPaymentForm
            title="Add Payment Method"
            clientSecret={clientSecret}
            onCancel={handleCancel}
          />
        </Elements>
      )}
      <div
        className={`${
          isLoading || error
            ? "text-center"
            : "grid grid-cols-1 lg:grid-cols-2 gap-10"
        }`}
      >
        {content}
      </div>
    </BaseSection>
  );
}
