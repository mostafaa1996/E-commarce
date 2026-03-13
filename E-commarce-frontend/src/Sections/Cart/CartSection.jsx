import CartRow from "../CartRow";
import CartTotals from "@/components/genericComponents/CartTotals";
import Button from "@/components/genericComponents/Button";
import { useCartStore } from "@/zustand_Cart/CartStore";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { syncCart, getCart } from "@/APIs/CartService";
import Loading from "@/components/genericComponents/Loading";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
export default function CartSection() {
  const navigate = useNavigate();
  const cartStore = useCartStore();
  const location = useLocation();
  let content = null;

  const {
    data: cart,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  const syncCartMutation = useMutation({
    mutationFn: ({ActionType}) => syncCart({ActionType}),
  });

  useEffect(() => {
    syncCartMutation.mutate({ActionType: "update"});
  }, [location, syncCartMutation]);

  function handleCheckout() {
    navigate("/checkout");
  }
  function handleClearCart() {
    cartStore.clearCart();
    syncCartMutation.mutate({ActionType: "clear"});
  }
  function handleContinueShopping() {
    navigate("/shop");
  }

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center py-20">
        <Loading />
      </div>
    );
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
          <CartRow key={`CartRow - ${item.title}`} item={item} />
        ))}

        {/* Totals */}
        <CartTotals
          TotalItems={cart.totalItems}
          total={cart.totalPrice}
          VAT={0.14 * cart.totalPrice}
          shipping={0.1 * cart.totalPrice}
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
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <Loading />
        </div>
      )}
    </section>
  );
}
