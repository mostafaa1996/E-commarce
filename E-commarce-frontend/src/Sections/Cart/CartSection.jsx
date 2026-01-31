import CartRow from "../CartRow";
import CartTotals from "../../../components/genericComponents/CartTotals";
import Button from "../../../components/genericComponents/Button";
import { useCartStore } from "../../zustand_Cart/CartStore";
export default function CartSection() {
  const cartStore = useCartStore();
  const cartItems = cartStore.items;
  const TotalItems = cartStore.totalItems;
  const total = cartStore.totalPrice;
  return (
    <section className="py-20 bg-white">
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
        {cartItems.map((item) => (
          <CartRow key={`CartRow - ${item.title}`} item={item} />
        ))}

        {/* Totals */}
        <CartTotals TotalItems={TotalItems} total={total} />

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-10">
          <Button className="w-fit tracking-widest">CLEAR CART</Button>
          <Button className="w-fit tracking-widest">CONTINUE SHOPPING</Button>
          <Button className="w-fit tracking-widest">PROCEED TO CHECKOUT</Button>
        </div>
      </div>
    </section>
  );
}
