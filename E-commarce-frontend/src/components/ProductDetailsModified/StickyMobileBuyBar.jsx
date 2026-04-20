import { ShoppingCart, Zap } from "lucide-react";

const formatCurrency = (n, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

const StickyMobileBuyBar = ({ variant, currency = "USD", onAddToCart, onBuyNow }) => {
  const oos = variant.availabilityStatus === "out_of_stock" || variant.stock === 0;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl shadow-elevated md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-lg font-bold leading-tight text-foreground">{formatCurrency(variant.price, currency)}</div>
        </div>
        <button
          onClick={() => onAddToCart?.(1)}
          disabled={oos}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-foreground bg-foreground text-sm font-semibold text-background transition-smooth disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          Add
        </button>
        <button
          onClick={() => onBuyNow?.(1)}
          disabled={oos}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-glow transition-smooth disabled:opacity-50"
        >
          <Zap className="h-4 w-4" fill="currentColor" />
          Buy now
        </button>
      </div>
    </div>
  );
};

export default StickyMobileBuyBar;
