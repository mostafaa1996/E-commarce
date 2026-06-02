import clsx from "clsx";
import { Fragment } from "react";

function TotalsRow({ label, value, labelClassName, valueClassName }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-base font-light">
      <span className={clsx("text-zinc-600", labelClassName)}>{label}</span>
      <span className={clsx("text-right font-light", valueClassName)}>
        {value}
      </span>
    </div>
  );
}

export default function CartTotals({
  TotalItems,
  Items,
  itemsPrice = 0,
  priceAfterPromo = 0,
  tax = 0,  
  totalPrice = 0,
  promo = 0,
  promoCode,
  VAT = 0,
  shipping = 0,
  format = (n) => n,
  rate = 1,
  className,
}) {
  const promoValue = Number(promo) || 0;
  const hasPromo = promoValue > 0;
  
  return (
    <div className={clsx("", className)}>
      <div>
        <h3 className="mb-4 mt-8 text-2xl font-light uppercase text-[#272727] sm:mb-6">
          CART TOTALS
        </h3>
        <div className="w-full h-[1px] bg-zinc-300" />
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-300 py-3 text-base font-light sm:py-2">
        <span>Total Items</span>
        <span className="text-right text-[#FF6543]">{TotalItems}</span>
        {Items?.map((item) => (
          <Fragment key={`checkout Cart Totals title` + item.id} >
            <p className="ml-4 text-base font-light text-zinc-500 line-clamp-1">
              {item.title}
            </p>
            <p className="text-base font-light text-zinc-500">
              {format(item.price * rate)} {<span className="text-[#FF6543]">X</span>} {item.quantity}
            </p>
          </Fragment>
        ))}
      </div>

      <div className="border-b border-zinc-300 py-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3">
          <TotalsRow
            label="Subtotal before promo"
            value={format(itemsPrice * rate)}
            valueClassName="text-[#FF6543]"
          />

          {hasPromo && (
            <>
              <div className="my-3 border-t border-dashed border-zinc-300" />
              <TotalsRow
                label={
                  <span className="flex flex-col gap-1">
                    <span>Promo discount</span>
                    {promoCode && (
                      <span className="w-fit rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {promoCode}
                      </span>
                    )}
                  </span>
                }
                value={`- ${format(promoValue * rate)}`}
                valueClassName="text-emerald-600"
              />
              <div className="my-3 border-t border-zinc-200" />
              <TotalsRow
                label="Subtotal after promo"
                value={format(priceAfterPromo * rate)}
                labelClassName="text-zinc-800"
                valueClassName="text-[#FF6543]"
              />
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-300 py-3 text-base font-light sm:py-2">
        <span>VAT</span>
        <span className="text-right text-[#FF6543]">{format(tax * rate)}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-300 py-3 text-base font-light sm:py-2">
        <span>Shipping</span>
        <span className="text-right text-[#FF6543]">{format(shipping * rate)}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-300 py-3 text-base font-light sm:py-2">
        <span>Total Price</span>
        <span className="text-right text-[#FF6543]">
          {format(totalPrice * rate)}
        </span>
      </div>
    </div>
  );
}
