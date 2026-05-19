import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItemCard({
  item,
  onUpdate,
  onRemove,
  formatPrice = (price) => price.toFixed(2),
  rate = 1,
}) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-md sm:flex sm:gap-4 sm:p-5">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex flex-col justify-between gap-4 sm:flex-1 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:truncate sm:text-base">
            {item.title}
          </h3>
          <p className="mt-1 truncate text-[11px] text-muted-foreground sm:text-xs">
            SKU: {item.sku}
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-primary sm:text-base">
              {formatPrice(item.price * rate)}
            </span>
            {item.compareAtPrice && (
              <span className="text-[11px] text-muted-foreground line-through sm:text-xs">
                {formatPrice(item.compareAtPrice * rate)}
              </span>
            )}
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-between gap-3 border-t border-border pt-3 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end">
          <div className="inline-flex items-center rounded-full border border-border bg-background">
            <button
              onClick={() => onUpdate(item, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdate(item, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="min-w-0 text-right text-sm font-bold text-foreground sm:text-base">
              {formatPrice(lineTotal * rate)}
            </span>
            <button
              onClick={() => onRemove(item)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
