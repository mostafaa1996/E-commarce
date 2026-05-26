import { Link } from "react-router-dom";
import CartItemCard from "./CartItemCard";

export default function CartItemsList({
  items,
  onUpdate,
  onRemove,
  shoppingLink = "/shop",
  formatPrice = (price) => price.toFixed(2),
  rate = 1,
}) {
  return (
    <section className="space-y-3 sm:space-y-4">
      {items.map((item) => (
        <CartItemCard
          key={item._id}
          item={item}
          onUpdate={onUpdate}
          onRemove={onRemove}
          formatPrice={formatPrice}
          rate={rate} 
        />
      ))}

      <Link
        to={shoppingLink}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-primary hover:border-primary/30 hover:bg-primary/5 sm:w-auto sm:border-0 sm:justify-start sm:py-0 sm:pt-4 sm:hover:bg-transparent sm:hover:underline"
      >
        Continue shopping
      </Link>
    </section>
  );
}
