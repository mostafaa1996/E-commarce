import CartRow from "../../components/genericComponents/CartRow";
import CartTotals from "@/components/genericComponents/CartTotals";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import useCurrency from "@/hooks/CurrencyChange";
import  useCart  from "@/hooks/useCart";
export default function CartSection() {
  let content = null;
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const { cart, handleCheckout, handleClearCart, handleContinueShopping } = useCart();

  if (cart?.items?.length === 0) {
    content = (
      <div className="flex items-center justify-center py-20">
        <p className="text-2xl">Your cart is empty</p>
      </div>
    );
  }

  if (cart && cart?.items?.length > 0) {
    content = (
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 hidden grid-cols-6 gap-6 text-sm uppercase text-zinc-500 sm:grid">
          <span className="col-span-2">Product</span>
          <span className="col-span-1 text-right">Quantity</span>
          <span className="col-span-2 text-right">Subtotal</span>
          <span className="col-span-1 text-center">Remove</span>
        </div>

        <div
          className="mb-4 mt-4 h-[10px] sm:mb-2 sm:mt-6"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #D4D4D4 0 2px, transparent 2px 10px)",
          }}
        />

        {/* Rows */}
        <div className="space-y-3 sm:space-y-0">
          {cart.items.map((item) => (
            <CartRow
              key={`CartRow - ${item.title}`}
              item={item}
              format={format}
              rate={rate}
            />
          ))}
        </div>

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
        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
          <AdminButton
            onClick={handleClearCart}
            className="w-full tracking-widest sm:w-fit"
          >
            CLEAR CART
          </AdminButton>
          <AdminButton
            onClick={handleContinueShopping}
            className="w-full tracking-widest sm:w-fit"
          >
            CONTINUE SHOPPING
          </AdminButton>
          <AdminButton
            onClick={handleCheckout}
            className="w-full tracking-widest sm:w-fit"
          >
            PROCEED TO CHECKOUT
          </AdminButton>
        </div>
      </div>
    );
  }

  return <section className="bg-white py-10 sm:py-20">{content}</section>;
}
