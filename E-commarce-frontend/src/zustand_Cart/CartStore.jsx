import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(  
  persist(
    (set, get) => ({
      items: [],        // [{ productId, title, price, quantity, image, subTotal }]
      totalItems: 0,
      totalPrice: 0,

      addItem(product, quantity = 1) {
        console.log(product);
        const items = [...get().items];
        const existing = items.find(
          (i) => i._id === product._id
        );
        console.log(existing);
        if (existing) {
          existing.quantity = quantity;
          existing.subTotal = existing.quantity * existing.price;
        } else {
          items.push({
            _id:product._id,
            title: product.title,
            price: product.price,
            image: product.images[0].url,
            quantity,
            subTotal: product.price * quantity,
          });
        }

        set({
          items,
          totalItems: items.reduce((s, i) => s + i.quantity, 0),
          totalPrice: items.reduce((s, i) => s + i.subTotal, 0),
        });

        // console.log(get().items);
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
      },
      setCart(cart) {
        set({
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
        });
      }
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
