export default function CartPageTitle({ itemCount, onClear }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8 sm:items-end">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Your Cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
        </p>
      </div>
      {itemCount > 0 && (
        <button
          onClick={onClear}
          className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-destructive/30 hover:text-destructive sm:border-0 sm:px-0 sm:py-0 sm:text-sm"
        >
          Clear cart
        </button>
      )}
    </div>
  );
}
