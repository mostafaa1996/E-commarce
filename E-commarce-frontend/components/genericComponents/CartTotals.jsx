export default function CartTotals({ subtotal, total }) {
  return (
    <div className="mt-10 pt-6">
      <div>
        <h3 className="text-[30px] font-extralight text-[#272727] mb-6 uppercase">
          CART TOTALS
        </h3>
        <div className="w-full h-[1px] bg-zinc-300" />
      </div>
      <div className="grid grid-cols-2 py-2 border-b border-zinc-300 text-[21px] font-light">
        <span>Subtotal</span>
        <span className="text-[#FF6543]">${subtotal.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-2 py-2 text-[21px] font-light border-b border-zinc-300">
        <span>Total</span>
        <span className="text-[#FF6543]">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
