import { create } from "zustand";
import { persist } from "zustand/middleware";

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
        building: "",
        Apartment: "",
        postalCode: "",
        phone: "",
        notes: "",
        isDefault: false,
      },
      PaymentMethod: "",

      clearCheckout: () => set({ CartInfo: {}, PaymentMethod: {} }),
      setCartInfo: (cart) => set({ CartInfo: cart }),
      setShippingDetails: (details) => set({ ShippingDetails: details }),
      setPaymentMethod: (method) => set({ PaymentMethod: method }),
    }),
    {
      name: "checkout-storage", // localStorage key
      partialize: (state) => ({
        ShippingDetails: state.ShippingDetails,
      }),
    },
  ),
);
