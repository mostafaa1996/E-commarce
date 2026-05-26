import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function EmptyCart({shoppingLink = "/shop"}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-4 py-14 text-center sm:py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted sm:h-16 sm:w-16">
        <ShoppingBag className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-foreground sm:text-lg">
        Your cart is empty
      </h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Looks like you have not added anything yet.
      </p>
      <Link
        to={shoppingLink}
        className="mt-6 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
      >
        Start shopping <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
