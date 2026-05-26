import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingProductCard({ product, badgeOverride , format = (price) => price , rate = 1}) {
  const badge = badgeOverride || product.badge;
  return (
    <Link
      className="group rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
      to={`/shop/products/${product._id}`}
    >
      <div className="flex aspect-[4/4.4] items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 via-background to-amber-50 text-6xl">
        <img src={product.image} alt={product.title} className="max-h-50" />
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
              {product.title}
            </h3>
          </div>
          {badge && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
              {badge}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-foreground">
              {format(product.price * rate)}
            </span>
            {product.pricing && (
              <span className="text-sm text-muted-foreground line-through">
                {format(product.pricing.maxPrice * rate)}
              </span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 text-sm font-medium text-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {product.rating}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
