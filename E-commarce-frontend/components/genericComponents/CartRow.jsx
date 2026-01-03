import QuantityControl from "./QuantityControl";
import ProductRow from "./ProductCard_H";
export default function CartRow({ item }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 py-6 ">
      {/* Product */}
      <div className="col-span-2">
        <ProductRow image={item.image} title={item.title} price={item.price} />
      </div>

      {/* Quantity */}
      <div className="col-span-1 flex justify-end">
        <QuantityControl value={item.qty} />
      </div>
      {/* Subtotal */}
      <p className="col-span-2  text-[#FF6543] text-right font-light text-[18px] flex justify-end items-center">
        ${(item.price * item.qty).toFixed(2)}
      </p>
      {/* Remove */}
      <button className={`
         hover:text-red-500 transition w-10 justify-self-center `}>
        <img className="w-fit" src="/RemoveCart.svg" alt="Remove" />
      </button>
    </div>
  );
}
