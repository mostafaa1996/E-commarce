import QuantityControl from "@/components/genericComponents/QuantityControl";
import ProductRow from "@/components/genericComponents/ProductCard_H";
import RemoveCart from "/RemoveCart.svg";
import RemoveCartHover from "/RemoveCartHover.svg";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClient";
import { syncCart } from "@/APIs/CartService";

export default function CartRow({ item, format = (n) => n, rate = 1 }) {
  const [displayedQuantity, setdisplayedQuantity] = useState(item.quantity);
  const syncCartMutation = useMutation({
    mutationFn: ({ ActionType, productId, quantity }) =>
      syncCart({ ActionType, productId, quantity }),
    onMutate: ({ ActionType, productId, quantity }) => {
      //optimistic update
      queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      const previousDisplayedQuantity = displayedQuantity;
      if (ActionType === "add") {
        setdisplayedQuantity(quantity);
        queryClient.setQueryData(["cart"], (oldCart) => {
          if (!oldCart) return null;
          return {
            ...oldCart,
            items: oldCart.items.map((item) => {
              if (item._id === productId) {
                return {
                  ...item,
                  quantity,
                  subtotal: item.price * quantity,
                };
              }
              return item;
            }),
            totalItems: oldCart.totalItems + quantity,
            totalPrice: oldCart.totalPrice + item.price * quantity,
            updatedAt: new Date(),
          };
        });
      }
      if (ActionType === "remove") {
        queryClient.setQueryData(["cart"], (oldCart) => {
          if (!oldCart) return null;
          return {
            ...oldCart,
            items: oldCart.items.filter((item) => item._id !== productId),
            totalItems: oldCart.totalItems - item.quantity,
            totalPrice: oldCart.totalPrice - item.price * item.quantity,
            updatedAt: new Date(),
          };
        });
      }
      return { previousCart, previousDisplayedQuantity };
    },
    onError: (context) => {
      if (context.previousDisplayedQuantity)
        setdisplayedQuantity(context.previousDisplayedQuantity);
      if (context.previousCart)
        queryClient.setQueryData(["cart"], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
  });

  function onChangeQuantity(newQuantity) {
    if (newQuantity === 0) {
      handleRemove();
      return;
    }
    syncCartMutation.mutate({
      ActionType: "add",
      productId: item._id,
      quantity: newQuantity,
    });
  }

  function handleRemove() {
    syncCartMutation.mutate({
      ActionType: "remove",
      productId: item._id,
      quantity: 0,
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-6 sm:gap-6 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:py-6 sm:shadow-none">
      {/* Product */}
      <div className="sm:col-span-2">
        <ProductRow
          image={item.image}
          title={item.title}
          price={format(item.price * rate)}
        />
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-4 sm:col-span-1 sm:justify-end sm:border-t-0 sm:pt-0">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:hidden">
          Quantity
        </span>
        <QuantityControl
          value={displayedQuantity}
          onChange={onChangeQuantity}
        />
      </div>
      {/* Subtotal */}
      <div className="flex items-center justify-between sm:col-span-2 sm:justify-end">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:hidden">
          Subtotal
        </span>
        <p className="text-right text-[18px] font-light text-[#FF6543]">
          {format(item.price * item.quantity * rate)}
        </p>
      </div>
      {/* Remove */}
      <button
        className="group flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-200 text-sm font-light text-[#272727] transition-colors hover:border-[#FF6543] hover:text-[#FF6543] sm:w-10 sm:justify-self-center sm:border-0"
        onClick={handleRemove}
      >
        <img
          className="block w-5 group-hover:hidden sm:w-fit"
          src={RemoveCart}
          alt="Remove"
        />
        <img
          className="hidden w-5 group-hover:block sm:w-fit"
          src={RemoveCartHover}
          alt="Remove"
        />
        <span className="sm:hidden">Remove</span>
      </button>
    </div>
  );
}
