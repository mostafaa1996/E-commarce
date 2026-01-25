import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(  
  persist(
    (set, get) => ({
      items: [],        // [{ productId, title, price, quantity, image, subTotal }]
      totalItems: 0,
      totalPrice: 0,

      addItem(product, quantity = 1) {
        const items = [...get().items];
        const existing = items.find(
          (i) => i._id === product._id
        );
        
        if (existing) {
          existing.quantity = quantity;
          existing.subTotal = existing.quantity * existing.price;
        } else {
          items.push({
            ...product,
            quantity,
            subTotal: product.price * quantity,
          });
        }

        set({
          items,
          totalItems: items.reduce((s, i) => s + i.quantity, 0),
          totalPrice: items.reduce((s, i) => s + i.subTotal, 0),
        });

        console.log(get().items);
      },

      removeItem(productId) {
        const items = get().items.filter(i => i._id !== productId);
        set({
          items,
          totalItems: items.reduce((s, i) => s + i.quantity, 0),
          totalPrice: items.reduce((s, i) => s + i.subTotal, 0),
        });
      },

      clearCart() {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      getItemQuantity(productId) {
        const item = get().items.find(i => i._id === productId);
        return item ? item.quantity : 0;
      }
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
