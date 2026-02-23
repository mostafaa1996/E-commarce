import { useEffect, useState } from "react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/genericComponents/RadioGroup";
import { Label } from "@/components/genericComponents/label";
import InputField from "@/components/genericComponents/InputField";
import Button from "@/components/genericComponents/Button";
import { CreditCard, Banknote, Truck, CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCheckoutStore } from "@/zustand_checkout/checkoutStore";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCards } from "@/APIs/checkoutService";
import SelectButton from "@/components/genericComponents/SelectButton";

const SAVED_CARDS = [
  { id: "1", last4: "4242", brand: "Visa", expiry: "12/27" },
  { id: "2", last4: "8888", brand: "Mastercard", expiry: "06/26" },
];

const PaymentMethod = () => {
  const [paymentType, setPaymentType] = useState("cod");
  const [useNewCard, setUseNewCard] = useState(false);
  const navigate = useNavigate();
  const setPayment = useCheckoutStore((state) => state.setPaymentMethod);
  const currentState = useCheckoutStore((state) => state.currentState);
  const response = useCheckoutStore((state) => state.ServerResponse);
  const setCardForm = useCheckoutStore((state) => state.setCardForm);
  const cardForm = useCheckoutStore((state) => state.CardForm);
  const resetCardForm = useCheckoutStore((state) => state.resetCardForm);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["savedCards"],
    queryFn: fetchCards,
    enabled: paymentType === "card",
  });

  useEffect(() => {
    setPayment(paymentType);
  }, [setPayment, paymentType, refetch]);

  const [selectedCard, setSelectedCard] = useState(
    data?.savedCards[0]?._id || "",
  );

  function handleCardForm(e) {
    const { name, value } = e.target;
    setCardForm({
      ...cardForm,
      [name]: value,
    });
    //  console.log(cardForm);
  }

  function handleUseSavdCardsButton() {
    resetCardForm();
    setUseNewCard(false);
  }
  const handlePlaceOrder = () => {
    if (paymentType === "cod") {
      toast.success("Order placed! Pay on delivery.");
    } else {
      toast.success("Payment successful! Order confirmed.");
    }
  };

  if (currentState === "OrderPlaced") {
    handlePlaceOrder();
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in-0 zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-full bg-[#E5E5E5] flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Order Confirmed!</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          {paymentType === "cod"
            ? "Your order has been placed. Please have the payment ready upon delivery."
            : "Your payment was processed successfully. Your order is on its way!"}
        </p>
        <p className="text-sm text-muted-foreground">
          Order #ORD-{response?.orderId}
        </p>
        <Button
          type="button"
          className="w-fit tracking-widest"
          onClick={() => {
            useCheckoutStore.getState().clearCheckout();
            navigate("/shop");
          }}
        >
          OK
        </Button>
      </div>
    );
  }

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
          <Truck className="w-5 h-5 text-muted-foreground" />
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
          <CreditCard className="w-5 h-5 text-muted-foreground" />
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
            <Banknote className="w-5 h-5 text-accent-foreground mt-0.5 shrink-0" />
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
          {data && !useNewCard && data.savedCards.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Saved Cards</p>
              <RadioGroup
                value={selectedCard}
                onValueChange={setSelectedCard}
                className="space-y-2"
              >
                {data.savedCards.map((card) => (
                  <Label
                    key={card._id}
                    htmlFor={`card-${card._id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCard === card._id
                        ? "border-[#FF6543] bg-[#F5F5F5] shadow-sm"
                        : "border-[#F5F5F5] bg-card hover:border-[#FF6543]/30"
                    }`}
                  >
                    <RadioGroupItem value={card._id} id={`card-${card._id}`} />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="font-medium text-foreground text-sm">
                        {card.brand} •••• {card.last4}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Expires {card.expiry}
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
              <button
                type="button"
                onClick={() => setUseNewCard(true)}
                className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" /> Use a different card
              </button>
            </div>
          ) : !isLoading ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">
                Card Details
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Card Number
                  </Label>
                  <InputField
                    type="number"
                    maxLength={16}
                    name="cardNumber"
                    onChange={handleCardForm}
                    placeholder="1234 5678 9012 3456"
                    className="bg-card border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Expiry Date
                    </Label>
                    <InputField
                      type="text"
                      maxLength={5}
                      name="expiry"
                      onChange={handleCardForm}
                      placeholder="MM/YY"
                      className="bg-card border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">CVV</Label>
                    <InputField
                      name="cvc"
                      onChange={handleCardForm}
                      placeholder="•••"
                      type="password"
                      maxLength={4}
                      className="bg-card border-border"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Cardholder Name
                  </Label>
                  <InputField
                    type="text"
                    name="cardholderName"
                    onChange={handleCardForm}
                    placeholder="Name on card"
                    className="bg-card border-border"
                  />
                </div>
              </div>
              <SelectButton
                type="checkbox"
                name="saveCard"
                label={"Save this card"}
                value={cardForm.saveCard}
                checked={cardForm.saveCard}
                onChange={() => {
                  setCardForm({ ...cardForm, saveCard: !cardForm.saveCard });
                }}
              />
              {SAVED_CARDS.length > 0 && (
                <button
                  type="button"
                  onClick={handleUseSavdCardsButton}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  ← Use a saved card
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p>loading ... </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
