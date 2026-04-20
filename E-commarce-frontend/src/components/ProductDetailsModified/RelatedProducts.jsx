const RelatedProducts = (items) => {
  return (
    <section className="container py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">You might also like</h2>
          <p className="mt-1 text-sm text-muted-foreground">Hand-picked just for you</p>
        </div>
        <a href="#" className="hidden text-sm font-semibold text-primary hover:underline md:block">View all →</a>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {items && Array.isArray(items) && items.map((_, i) => (
          <div key={i} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-smooth hover:shadow-elevated">
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-secondary/30">
              <div className="h-full w-full animate-pulse bg-secondary/50" />
            </div>
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 rounded-full bg-secondary animate-pulse" />
              <div className="h-4 w-full rounded-full bg-secondary animate-pulse" />
              <div className="h-4 w-2/3 rounded-full bg-secondary animate-pulse" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-5 w-14 rounded-full bg-secondary animate-pulse" />
                <div className="h-7 w-7 rounded-full bg-secondary animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
