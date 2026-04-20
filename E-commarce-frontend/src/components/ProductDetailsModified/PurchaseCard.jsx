import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from "lucide-react";

const formatCurrency = (n, c = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(n);

const PurchaseCard = ({
  variant,
  currency = "USD",
  onAddToCart,
  onRemoveFromCart,
  onBuyNow,
  onWishlist = false,
  onUpdateWishlist,
  initiallyInCart = false,
  initialQty = 0,
}) => {
  const [wished, setWished] = useState(onWishlist);
  const [qty, setQty] = useState(initialQty);
  const [addedToCart, setAddedToCart] = useState(initiallyInCart);
  const max = Math.max(1, variant.stock);
  const oos =
    variant.availabilityStatus === "out_of_stock" || variant.stock === 0;
  const low =
    variant.availabilityStatus === "low_stock" ||
    (variant.stock > 0 && variant.stock <= variant.lowStockThreshold);
  const discount = variant.compareAtPrice
    ? Math.round(
        ((variant.compareAtPrice - variant.price) / variant.compareAtPrice) *
          100,
      )
    : 0;

  function changeWishlistState() {
    onUpdateWishlist();
    setWished(!wished);
  }

  function handleCartAction() {
    if (addedToCart) {
      onRemoveFromCart?.(qty);
      setAddedToCart(false);
      return;
    }
    onAddToCart?.(qty);
    setAddedToCart(true);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {formatCurrency(variant.price, currency)}
        </span>
        {variant.compareAtPrice && (
          <>
            <span className="text-base text-muted-foreground line-through">
              {formatCurrency(variant.compareAtPrice, currency)}
            </span>
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
              −{discount}%
            </span>
          </>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Tax included. Shipping calculated at checkout.
      </p>

      {/* Stock */}
      <div className="mt-5 flex items-center gap-2">
        {oos ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> Out of
            stock
          </span>
        ) : low ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />{" "}
            Only {variant.stock} left
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <Check className="h-3 w-3" strokeWidth={3} /> In stock —{" "}
            {variant.stock} available
          </span>
        )}
      </div>

      {/* Qty */}
      <div className="mt-5 flex items-center gap-4">
        <span className="text-sm font-semibold text-foreground">Quantity</span>
        <div className="inline-flex items-center rounded-xl border border-border bg-background">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={oos || qty <= 1}
            aria-label="Decrease"
            className="grid h-10 w-10 place-items-center rounded-l-xl text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold tabular-nums">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={oos || qty >= max}
            aria-label="Increase"
            className="grid h-10 w-10 place-items-center rounded-r-xl text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {addedToCart && (
          <span className="ml-3 text-sm font-semibold text-success">
            Added to cart
          </span>
        )}
      </div>

      {/* CTAs */}
      <div className="mt-5 space-y-2.5">
        <button
          onClick={() => onBuyNow?.(qty)}
          disabled={oos}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:bg-primary-hover hover:shadow-elevated active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          <Zap className="h-4 w-4" fill="currentColor" />
          Buy now
        </button>
        <button
          onClick={handleCartAction}
          disabled={oos}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-smooth active:scale-[0.98] disabled:cursor-not-allowed disabled:border-border disabled:bg-secondary disabled:text-muted-foreground ${
            addedToCart
              ? "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "border-foreground bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {addedToCart ? "Remove from cart" : "Add to cart"}
        </button>
        <button
          onClick={changeWishlistState}
          className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-smooth ${
            wished
              ? "border-primary bg-primary-soft text-primary"
              : "border-border bg-background text-foreground hover:bg-secondary"
          }`}
        >
          <Heart className="h-4 w-4" fill={wished ? "currentColor" : "none"} />
          Wishlist
        </button>
      </div>

      {/* Trust badges */}
      <div className="mt-6 space-y-3 border-t border-border pt-5">
        <div className="flex items-center gap-3 text-sm">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-foreground">Free shipping</div>
            <div className="text-xs text-muted-foreground">
              On orders over $50
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
            <RotateCcw className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-foreground">30-day returns</div>
            <div className="text-xs text-muted-foreground">
              Free, hassle-free
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-foreground">2-year warranty</div>
            <div className="text-xs text-muted-foreground">
              Manufacturer backed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;
