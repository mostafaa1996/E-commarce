import CartPageTitle from "@/components/Cart/CartPageTitle";
import CartItemsList from "@/components/Cart/CartItemsList";
import OrderSummary from "@/components/Cart/OrderSummary";
import EmptyCart from "@/components/Cart/EmptyCart";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import useCurrency from "@/hooks/CurrencyChange";
import useCart from "@/hooks/useCart";
import Loading from "@/components/genericComponents/Loading";

export default function CartPage() {
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;
  const {
    cart,
    isLoadingCart,
    cartError,
    handleCheckout,
    handleClearCart,
    updateItem,
    removeItem,
    promo,
    setPromo,
    appliedPromo,
    onApplyPromo,
    savings,
    discountInMoney,
    couponInfo,
  } = useCart();

  if (isLoadingCart && !cart) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <Loading message="Loading cart" fullPage />
        </main>
      </div>
    );
  }

  if (cartError && !cart) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
            <p className="font-semibold">Failed to load cart data.</p>
            <p className="mt-2 text-sm">
              {cartError.message || "Please try again later."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <CartPageTitle
          itemCount={cart?.items?.length ?? 0}
          onClear={handleClearCart}
        />

        {cart?.items?.length === 0 ? (
          <EmptyCart shoppingLink="/shop" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
            <CartItemsList
              items={cart?.items ?? []}
              onUpdate={updateItem}
              onRemove={removeItem}
              shoppingLink="/shop"
              formatPrice={format}
              rate={rate}
            />

            <OrderSummary
              promo={promo}
              appliedPromo={appliedPromo}
              subtotal={cart?.items?.reduce((acc, item) => acc + item.subtotal, 0) ?? 0}
              savings={savings}
              vat={cart?.vat ?? 0}
              shipping={cart?.shipping ?? 0}
              total={cart?.totalCost ?? 0}
              discount = {discountInMoney}
              onPromoChange={setPromo}
              onApplyPromo={onApplyPromo}
              goToCheckout={handleCheckout}
              couponInfo={couponInfo}
              formatPrice={format}
              rate={rate}
            />
          </div>
        )}
      </main>
    </div>
  );
}
