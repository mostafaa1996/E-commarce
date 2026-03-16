import { create } from "zustand";

// PaymentMethodState = [
//     "CashOnDelivery",
//     "CardSelected",
//     "AddingNewCard",
// ]

// orderState = [
//     "InProgress",
//     "orderPlaced",
//     "pending_payment",
//     "paid",
//     "payment_failed",
//     "cancelled"
//     "Loading",
//     "Error",
// ]

// paymentType = [
//     "cod",
//     "card",
// ]

// selectedCard = cardID in case of card payment

const useCheckoutStore = create((set) => ({
    PaymentMethodState: "CashOnDelivery",
    selectedCard: null,
    useNewCard: false,
    paymentType :"cod",
    orderState: "InProgress",
    orderId: null,
    setPaymentMethodState: (PaymentMethodState) => {
        return set({ PaymentMethodState });
    },
    setSelectedCard: (selectedCard) => {
        console.log(selectedCard);
        return set({ selectedCard });
    },
    setUseNewCard: (useNewCard) => {
        return set({ useNewCard });
    },
    setPaymentType: (paymentType) => {
        return set({ paymentType });
    },
    setOrderState: (orderState) => {
        return set({ orderState });
    },
    setOrderId: (orderId) => {
        return set({ orderId });
    },
}));

export default useCheckoutStore




