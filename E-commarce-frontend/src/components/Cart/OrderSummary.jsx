import { ArrowRight, Tag } from "lucide-react";

function SummaryRow({ label, value, accent }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right font-medium ${accent ?? "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

function isPercentageDiscount(discountType) {
  return String(discountType || "")
    .toLowerCase()
    .includes("percent");
}

function formatCouponValue(couponInfo, formatPrice, rate) {
  const discountValue = Number(couponInfo?.discountValue);

  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    return null;
  }

  if (isPercentageDiscount(couponInfo?.discountType)) {
    return `${discountValue}% off`;
  }

  return `- ${formatPrice(discountValue * rate)}`;
}

function CouponSummaryLine({ couponInfo, formatPrice, rate }) {
  const shouldShowCouponValue = couponInfo?.isEligible && couponInfo.discountValue > 0;

  if (shouldShowCouponValue) {
    return (
      <div className="flex items-start justify-between gap-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm">
        <span className="font-medium text-emerald-700">
          Coupon <br />{couponInfo?.code ? ` ${couponInfo.code}` : ""}
        </span>
        <span className="text-right font-semibold text-emerald-700">
          -{formatPrice(couponInfo.discountValue * rate)}
        </span>
      </div>
    );
  }

  if (couponInfo?.message) {
    return (
      <p className="rounded-xl bg-primary/5 px-3 py-2 text-sm font-medium text-primary">
        {couponInfo.message}
      </p>
    );
  }

  return null;
}

export default function OrderSummary({
  promo,
  appliedPromo,
  subtotal,
  savings,
  discount,
  total,
  vat,
  shipping,
  onPromoChange,
  onApplyPromo,
  goToCheckout,
  couponInfo,
  formatPrice = (price) => price.toFixed(2),
  rate = 1,
}) {
  return (
    <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:space-y-5 sm:p-6 lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
      {couponInfo && (
        <CouponSummaryLine
          couponInfo={couponInfo}
          formatPrice={formatPrice}
          rate={rate}
        />
      )}
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Promo code
        </label>
        <div className="flex flex-col gap-2 min-[420px]:flex-row">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={promo}
              onChange={(event) => onPromoChange(event.target.value)}
              placeholder="SAVE10"
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => onApplyPromo(promo)}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 min-[420px]:py-0"
          >
            Apply
          </button>
        </div>
        {appliedPromo && (
          <p className="mt-2 text-xs font-medium text-primary">
            {appliedPromo} applied ({formatCouponValue(couponInfo, formatPrice, rate)})
          </p>
        )}
      </div>

      <div className="space-y-3 border-t border-border pt-5 text-sm">
        <SummaryRow label="Subtotal" value={formatPrice(subtotal * rate)} />
        {savings > 0 && (
          <SummaryRow
            label="Savings"
            value={`- ${formatPrice(savings * rate)}`}
            accent="text-emerald-600"
          />
        )}
        {appliedPromo && (
          <SummaryRow
            label="Promo discount"
            value={`- ${formatPrice(discount * rate)}`}
            accent="text-emerald-600"
          />
        )}
        <SummaryRow label="VAT (14%)" value={formatPrice(vat * rate)} />
        <SummaryRow
          label="Shipping"
          value={shipping === 0 ? "Free" : formatPrice(shipping * rate)}
        />
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-border pt-5">
        <span className="text-base font-semibold text-foreground">Total</span>
        <span className="text-right text-xl font-bold text-foreground sm:text-2xl">
          {appliedPromo ? formatPrice((total - discount) * rate) :  formatPrice(total * rate)}
        </span>
      </div>

      <button
        onClick={() => {
          goToCheckout();
        }}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
      >
        Proceed to Checkout
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Secure checkout.
      </p>
    </aside>
  );
}
