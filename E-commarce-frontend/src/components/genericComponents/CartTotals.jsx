import clsx from "clsx";
import { Fragment } from "react";

export default function CartTotals({
  TotalItems,
  Items,
  total,
  VAT = 0,
  shipping = 0,
  format = (n) => n,
  rate = 1,
  className,
}) {
  
  return (
    <div className={clsx("", className)}>
      <div>
        <h3 className="mb-4 mt-8 text-2xl font-extralight uppercase text-[#272727] sm:mb-6 sm:text-[30px]">
          CART TOTALS
        </h3>
        <div className="w-full h-[1px] bg-zinc-300" />
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-300 py-3 text-base font-light sm:py-2 sm:text-[21px]">
        <span>Total Items</span>
        <span className="text-right text-[#FF6543] sm:text-left">{TotalItems}</span>
        {Items?.map((item) => (
          <Fragment key={`checkout Cart Totals title` + item.id} >
            <p className="ml-4 text-sm text-zinc-500 line-clamp-1">
              {item.title}
            </p>
            <p className="text-sm text-zinc-500">
              {format(item.price * rate)} {<span className="text-[#FF6543]">X</span>} {item.quantity}
            </p>
          </Fragment>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-300 py-3 text-base font-light sm:py-2 sm:text-[21px]">
        <span>SubTotal</span>
        <span className="text-right text-[#FF6543] sm:text-left">{format(total*rate)}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-300 py-3 text-base font-light sm:py-2 sm:text-[21px]">
        <span>VAT</span>
        <span className="text-right text-[#FF6543] sm:text-left">{format(VAT*rate*total)}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-300 py-3 text-base font-light sm:py-2 sm:text-[21px]">
        <span>Shipping</span>
        <span className="text-right text-[#FF6543] sm:text-left">{format(shipping*rate*total)}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-zinc-300 py-3 text-base font-light sm:py-2 sm:text-[21px]">
        <span>Total Price</span>
        <span className="text-right text-[#FF6543] sm:text-left">
          {format((total + VAT*total + shipping*total)*rate)}
        </span>
      </div>
    </div>
  );
}
