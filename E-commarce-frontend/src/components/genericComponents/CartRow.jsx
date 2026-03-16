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
    mutationFn: ({ ActionType, id, quantity }) =>
      syncCart({ ActionType, id, quantity }),
    onMutate: ({ ActionType, id, quantity }) => {
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
              if (item._id === id) {
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
            items: oldCart.items.filter((item) => item._id !== id),
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
    },
  });

  function onChangeQuantity(newQuantity) {
    if (newQuantity === 0) {
      handleRemove();
      return;
    }
    syncCartMutation.mutate({
      ActionType: "add",
      id: item._id,
      quantity: newQuantity,
    });
  }

  function handleRemove() {
    syncCartMutation.mutate({
      ActionType: "remove",
      id: item._id,
      quantity: 0,
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 py-6 ">
      {/* Product */}
      <div className="col-span-2">
        <ProductRow
          image={item.image}
          title={item.title}
          price={format(item.price * rate)}
        />
      </div>

      {/* Quantity */}
      <div className="col-span-1 flex justify-end">
        <QuantityControl
          value={displayedQuantity}
          onChange={onChangeQuantity}
        />
      </div>
      {/* Subtotal */}
      <p className="col-span-2  text-[#FF6543] text-right font-light text-[18px] flex justify-end items-center">
        {format(item.price * item.quantity * rate)}
      </p>
      {/* Remove */}
      <button
        className={`w-10 justify-self-center cursor-pointer group `}
        onClick={handleRemove}
      >
        <img
          className="w-fit block  group-hover:hidden"
          src={RemoveCart}
          alt="Remove"
        />
        <img
          className="w-fit hidden group-hover:block"
          src={RemoveCartHover}
          alt="Remove"
        />
      </button>
    </div>
  );
}
