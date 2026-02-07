import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCheckoutStore = create(
  persist(
    (set, get) => ({
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
      PaymentMethod: {
        CardBrand: "",
        last4Digits: "",
        expMonth: "",
        expYear: "",
        isDefault: false,
      },

      setCartInfo: (cart) => set({ CartInfo: cart }),
      setShippingDetails: (details) => set({ ShippingDetails: details }),
      setPaymentMethod: (method) => set({ PaymentMethod: method }),
      getCartInfo: () => get().CartInfo,
      getShippingDetails: () => get().ShippingDetails,
      getPaymentMethod: () => get().PaymentMethod,
    }),
    {
      name: "checkout-storage", // localStorage key
    },
  ),
);
