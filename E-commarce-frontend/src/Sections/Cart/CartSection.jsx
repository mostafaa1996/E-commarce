import CartRow from "../../components/genericComponents/CartRow";
import CartTotals from "@/components/genericComponents/CartTotals";
import Button from "@/components/genericComponents/Button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { syncCart, getCart } from "@/APIs/CartService";
import { useCurrencyStore } from "@/zustand_preferences/currency"; 
import useCurrency from "@/hooks/CurrencyChange";
import { queryClient } from "@/queryClient";


export default function CartSection() {
  const navigate = useNavigate();
  let content = null;
  const { currency , locale , conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency]??1;

  const { //update cartStore from database
    data: cart,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    placeholderData: (previousData) => previousData,
  });

  const syncCartMutation = useMutation({
    mutationFn: ({ ActionType, id, quantity }) =>
      syncCart({ ActionType, id, quantity }),
    onMutate: ({ ActionType, id, quantity }) => {
      //optimistic update
      queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      if (ActionType === "clear") {
        queryClient.setQueryData(["cart"], (oldCart) => {
          if (!oldCart) return null;
          return {
            ...oldCart,
            items: [],
            totalItems: 0,
            totalPrice: 0,
            updatedAt: new Date(),
          };
        });
      }
      return { previousCart };
    },
    onError: (context) => {
      if (context.previousCart)
        queryClient.setQueryData(["cart"], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
  });

  function handleCheckout() {
    navigate("/checkout");
  }
  function handleClearCart() {
    syncCartMutation.mutate({ ActionType: "clear" , id: null , quantity: 0 });
  }
  function handleContinueShopping() {
    navigate("/shop");
  }

  if (cart?.items?.length === 0) {
    content = (
      <div className="flex items-center justify-center py-20">
        <p className="text-2xl">Your cart is empty</p>
      </div>
    );
  }

  if (cart && cart?.items?.length > 0) {
    content = (
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-5 gap-6 mb-6 text-sm text-zinc-500 uppercase">
          <span className="col-span-2">Product</span>
          <span className="col-span-1">Quantity</span>
          <span className="col-span-2 text-center">Subtotal</span>
        </div>

        <div
          className="mt-6 mb-2 h-[10px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #D4D4D4 0 2px, transparent 2px 10px)",
          }}
        />

        {/* Rows */}
        {cart.items.map((item) => (
          <CartRow
            key={`CartRow - ${item.title}`}
            item={item}
            format={format}
            rate={rate}
          />
        ))}

        {/* Totals */}
        <CartTotals
          TotalItems={cart.totalItems}
          total={cart.totalPrice}
          VAT={cart.VAT}
          shipping={cart.shipping}
          format={format}
          rate={rate}
        />

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-10">
          <Button onClick={handleClearCart} className="w-fit tracking-widest">
            CLEAR CART
          </Button>
          <Button
            onClick={handleContinueShopping}
            className="w-fit tracking-widest"
          >
            CONTINUE SHOPPING
          </Button>
          <Button onClick={handleCheckout} className="w-fit tracking-widest">
            PROCEED TO CHECKOUT
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      {content}
    </section>
  );
}
