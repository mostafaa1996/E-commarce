import QuantityControl from "../../components/genericComponents/QuantityControl";
import ProductRow from "../../components/genericComponents/ProductCard_H";
import RemoveCart from "/RemoveCart.svg";
import RemoveCartHover from "/RemoveCartHover.svg";
import { useCartStore } from "../zustand_Cart/CartStore";
export default function CartRow({ item }) {
  const CartStorage = useCartStore();
  
  function handleRemove() {
    CartStorage.removeItem(item._id);
  }
  function onchangeQuantity(value) {
    CartStorage.addItem(item, value);
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 py-6 ">
      {/* Product */}
      <div className="col-span-2">
        <ProductRow image={item.image} title={item.title} price={item.price} />
      </div>

      {/* Quantity */}
      <div className="col-span-1 flex justify-end">
        <QuantityControl value={item.quantity} onChange={onchangeQuantity} />
      </div>
      {/* Subtotal */}
      <p className="col-span-2  text-[#FF6543] text-right font-light text-[18px] flex justify-end items-center">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
      {/* Remove */}
      <button
        className={`w-10 justify-self-center cursor-pointer group `}
        onClick={handleRemove}
      >
        <img
          className="w-fit block  group-hover:hidden"
          src={RemoveCart}
          alt="Remove"
        />
        <img
          className="w-fit hidden group-hover:block"
          src={RemoveCartHover}
          alt="Remove"
        />
      </button>
    </div>
  );
}
