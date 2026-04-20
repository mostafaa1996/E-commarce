import Loading from "@/components/genericComponents/Loading";
import useCurrency from "@/hooks/CurrencyChange";
import { useCurrencyStore } from "@/zustand_preferences/currency";
import { Link } from "react-router-dom";

const RelatedProducts = ({ items, loading, error }) => {
  const { currency, locale, conversion_rate } = useCurrencyStore();
  const format = useCurrency(currency, locale);
  const rate = conversion_rate[currency] ?? 1;

  if (loading) {
    return (
      <section className="container py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              You might also like
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hand-picked just for you
            </p>
          </div>
        </div>
        <div className="flex min-h-40 items-center justify-center">
          <Loading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              You might also like
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hand-picked just for you
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-8 text-center">
          <p className="text-base font-semibold text-foreground">
            Failed to load related products
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      </section>
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <section className="container py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              You might also like
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hand-picked just for you
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl">
            +
          </div>
          <p className="mt-4 text-base font-semibold text-foreground">
            No related products yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon for more picks tailored to this item.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            You might also like
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Hand-picked just for you
          </p>
        </div>
        <a
          href="#"
          className="hidden text-sm font-semibold text-primary hover:underline md:block"
        >
          View all →
        </a>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {items.map((item) => (
          <Link
            key={item._id}
            to={`/shop/products/${item._id}`}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-smooth hover:shadow-elevated"
          >
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-secondary/30">
              {item.images?.[0]?.url ? (
                <img
                  src={item.images[0].url}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary/50 text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="space-y-2 p-4">
              <p className="line-clamp-2 min-h-10 text-sm font-semibold text-foreground md:text-base">
                {item.title}
              </p>
              <p className="text-sm font-bold text-primary md:text-base">
                {format((item.price ?? 0) * rate)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
