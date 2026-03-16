import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/genericComponents/RadioGroup";
import { Label } from "@/components/genericComponents/label";
import Icon from "@/system/icons/Icon";
import { useQuery } from "@tanstack/react-query";
import { getUserPaymentMethods } from "@/APIs/UserProfileService";
import SelectButton from "@/components/genericComponents/SelectButton";
import Loading from "@/components/genericComponents/Loading";
import { SetUpPaymentMethods } from "@/APIs/UserProfileService";
import EditPaymentForm from "@/Sections/UserProfile/EditPaymentForm";
import useCheckoutStore from "@/zustand_checkout/checkoutStore";
import StripeElementsWrapper from "@/components/genericComponents/stripeElementWrapper";
import { useEffect } from "react";

const PaymentMethod = () => {
  const {
    paymentType,
    useNewCard,
    selectedCard,
    setPaymentType,
    setPaymentMethodState,
    setSelectedCard,
    setUseNewCard,
  } = useCheckoutStore();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["profile-payments"],
    queryFn: getUserPaymentMethods,
    enabled: paymentType === "card",
  });

  if(cards){
    console.log(cards);
  }

  useEffect(() => {
  if (cards?.length > 0 && !selectedCard) {
    const defaultCard = cards.find((card) => card.isDefault);
    setSelectedCard(defaultCard?.id || cards[0].id);
  }
}, [cards, selectedCard , setSelectedCard]);

  return (
    <div className="space-y-5">
      <h2 className="text-[30px] font-extralight text-[#272727] mb-6 uppercase">
        Payment Method
      </h2>

      <RadioGroup
        value={paymentType}
        onValueChange={(val) => {
          setPaymentType(val);
          setUseNewCard(false);
          val === "card"
            ? setPaymentMethodState("CardSelected")
            : setPaymentMethodState("CashOnDelivery");
        }}
        className="space-y-3"
      >
        {/* Cash on Delivery */}
        <Label
          htmlFor="cod"
          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
            paymentType === "cod"
              ? "border-[#FF6543] bg-[#F5F5F5] shadow-sm"
              : "border-[#F5F5F5] bg-white hover:border-[#FF6543]/30"
          }`}
        >
          <RadioGroupItem value="cod" id="cod" />
          <Icon name="truck" size={20} strokeWidth={1.5} variant="primary" />
          <div>
            <span className="font-medium text-foreground">
              Cash on Delivery
            </span>
            <p className="text-xs text-muted-foreground">
              Pay when your order arrives
            </p>
          </div>
        </Label>

        {/* Card */}
        <Label
          htmlFor="card"
          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
            paymentType === "card"
              ? "border-[#FF6543] bg-[#F5F5F5] shadow-sm"
              : "border-[#F5F5F5] bg-card hover:border-[#FF6543]/30"
          }`}
        >
          <RadioGroupItem value="card" id="card" />
          <Icon name="payment" size={20} strokeWidth={1.5} variant="primary" />
          <div>
            <span className="font-medium text-foreground">
              Credit / Debit Card
            </span>
            <p className="text-xs text-muted-foreground">
              Pay securely with your card
            </p>
          </div>
        </Label>
      </RadioGroup>

      {/* COD Details */}
      {paymentType === "cod" && (
        <div className="p-4 rounded-lg bg-accent/30 border border-border animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <Icon
              name="banknote"
              size={20}
              strokeWidth={1.5}
              variant="primary"
              className="w-5 h-5 text-accent-foreground mt-0.5 shrink-0"
            />

            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Cash on Delivery Information
              </p>
              <p>
                Please have the exact amount ready when the delivery arrives.
              </p>
              <p>Our delivery agent will provide a receipt upon payment.</p>
            </div>
          </div>
        </div>
      )}

      {/* Card Details */}
      {paymentType === "card" && (
        <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          {cards && !useNewCard && cards.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Saved Cards</p>
              <RadioGroup
                value={selectedCard}
                onValueChange={(value) => setSelectedCard(value)}
                className="space-y-2"
              >
                {cards.map((card) => (
                  <Label
                    key={card.id}
                    htmlFor={`card-${card.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCard === card.id
                        ? "border-[#FF6543] bg-[#F5F5F5] shadow-sm"
                        : "border-[#F5F5F5] bg-card hover:border-[#FF6543]/30"
                    }`}
                  >
                    <RadioGroupItem value={card.id} id={`card-${card.id}`} />
                    <Icon
                      name="payment"
                      size={20}
                      strokeWidth={1.5}
                      variant="primary"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-foreground text-sm">
                        {card.brand} •••• {card.last4}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Expires {card.exp_month}/{card.exp_year}
                      </p>
                      <span className="font-medium text-foreground text-sm">
                        {card.name}
                      </span>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
              <button
                type="button"
                onClick={() => {
                  setUseNewCard(true);
                  setPaymentMethodState("AddingNewCard");
                }}
                className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer font-medium"
              >
                <Icon
                  name="plus"
                  size={20}
                  strokeWidth={1.5}
                  variant="primary"
                />{" "}
                Use a different card
              </button>
            </div>
          ) : !isLoading ? (
            //use new card
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">Card Form</p>
              <div className="space-y-3">
                <StripeElementsWrapper
                  open={useNewCard}
                  getClientSecret={SetUpPaymentMethods}
                >
                  {(clientSecret) => (
                    <EditPaymentForm
                      title="Add Payment Method"
                      clientSecret={clientSecret}
                      onCancel={() => {
                        setUseNewCard(false);
                        setPaymentMethodState("CardSelected");
                      }}
                    />
                  )}
                </StripeElementsWrapper>
              </div>
              {/* <SelectButton
                type="checkbox"
                name="saveCard"
                label={"Save this card"}
                value={"saveCard"}
                checked={false}
                onChange={() => {}}
              /> */}
              {cards.length > 0 && (
                <button
                  type="button"
                  onClick={()=> {
                    setUseNewCard(false);
                    setPaymentMethodState("CardSelected");
                  }}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  ← Use a saved card
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 flex items-center justify-center">
              <Loading />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
