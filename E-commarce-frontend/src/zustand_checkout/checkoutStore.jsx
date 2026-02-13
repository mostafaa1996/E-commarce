import { create } from "zustand";
import { persist } from "zustand/middleware";

const status = Object.freeze({
    idle: "idle",
    OrderPlaced: "OrderPlaced",
    PaymentProcessing: "PaymentProcessing",
    PaymentFailed: "PaymentFailed",
    loading: "loading",
    success: "success",
    error: "error",
});

export const useCheckoutStore = create(
  persist(
    (set) => ({
      CartInfo: { totalItems: 0, totalPrice: 0, items: [] },
      ShippingDetails: {
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        country: "",
        state: "",
        city: "",
        street: "",
        Apartment: "",
        postalCode: "",
        phone: "",
        isDefault: false,
      },
      PaymentMethod: "",
      orderNotes: "",
      shippingDetailsmodified : false,
      currentState : status.idle,

      clearCheckout: () => set({ CartInfo: {}, PaymentMethod: {} }),
      setCartInfo: (cart) => set({ CartInfo: cart }),
      setShippingDetails: (details) => set({ ShippingDetails: details }),
      setPaymentMethod: (method) => set({ PaymentMethod: method }),
      setOrderNotes: (notes) => set({ orderNotes: notes }),
      setShippingDetailsmodified: (modified) => set({ shippingDetailsmodified: modified }),
      setCurrentState: (state) => set({ currentState: state }),
    }),
    {
      name: "checkout-storage", // localStorage key
      partialize: (state) => ({
        ShippingDetails: state.ShippingDetails,
      }),
    },
  ),
);
