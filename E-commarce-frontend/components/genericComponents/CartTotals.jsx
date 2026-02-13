import clsx from "clsx";
import { Fragment } from "react";
export default function CartTotals({
  TotalItems,
  Items,
  total,
  VAT = 0,
  shipping = 0,
  className,
}) {
  return (
    <div className={clsx("", className)}>
      <div>
        <h3 className="text-[30px] font-extralight text-[#272727] mb-6 uppercase">
          CART TOTALS
        </h3>
        <div className="w-full h-[1px] bg-zinc-300" />
      </div>
      <div className="grid grid-cols-2 py-2 border-b border-zinc-300 text-[21px] font-light">
        <span>Total Items</span>
        <span className="text-[#FF6543]">{TotalItems}</span>
        {Items?.map((item) => (
          <Fragment key={`checkout Cart Totals title` + item.id} className = "flex flex-row">
            <p className="ml-4 text-sm text-zinc-500 line-clamp-1">
              {item.title}
            </p>
            <p className="text-sm text-zinc-500">
              ${item.price} {<span className="text-[#FF6543]">X</span>} {item.quantity}
            </p>
          </Fragment>
        ))}
      </div>
      <div className="grid grid-cols-2 py-2 border-b border-zinc-300 text-[21px] font-light">
        <span>SubTotal</span>
        <span className="text-[#FF6543]">{total.toFixed(2)}</span>
      </div>
      <div className="grid grid-cols-2 py-2 border-b border-zinc-300 text-[21px] font-light">
        <span>VAT</span>
        <span className="text-[#FF6543]">{VAT}</span>
      </div>
      <div className="grid grid-cols-2 py-2 border-b border-zinc-300 text-[21px] font-light">
        <span>Shipping</span>
        <span className="text-[#FF6543]">{shipping}</span>
      </div>
      <div className="grid grid-cols-2 py-2 text-[21px] font-light border-b border-zinc-300">
        <span>Total Price</span>
        <span className="text-[#FF6543]">
          ${(total + VAT + shipping).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
