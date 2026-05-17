import { Eye, Flame, Hash } from "lucide-react";
import StarRating from "./StarRating";

export default function ProductInfo({
  brand,
  title,
  description,
  isActive,
  isNew,
  rating,
  reviewsCount,
  soldCount,
  viewsCount,
  sku,
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {brand}
        </span>
        {isActive && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Available
          </span>
        )}
        {isNew && (
          <span className="inline-flex items-center rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background">
            New
          </span>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
          {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <StarRating rating={rating} size={16} showValue />
          <a
            href="#reviews"
            className="text-muted-foreground hover:text-primary hover:underline"
          >
            ({reviewsCount.toLocaleString()} reviews)
          </a>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Flame className="h-4 w-4 text-primary" />
          <span>
            <strong className="text-foreground">
              {soldCount.toLocaleString()}
            </strong>{" "}
            sold
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>{viewsCount.toLocaleString()} views</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Hash className="h-3 w-3" />
        <span>SKU:</span>
        <code className="rounded-md bg-secondary px-2 py-0.5 font-mono text-foreground">
          {sku}
        </code>
      </div>
    </>
  );
}
