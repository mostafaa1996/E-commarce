import { create } from "zustand";

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
        if(!orderState) orderState = "Error";
        return set({ orderState });
    },
    setOrderId: (orderId) => {
        return set({ orderId });
    },
}));

export default useCheckoutStore




