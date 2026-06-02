export default function ContactHeroSection({ storeInfo }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-background to-amber-50/40" />
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative container mx-auto max-w-3xl px-4 py-20 text-center md:py-28">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          We're here to help
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
          Contact{" "}
          <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            {storeInfo.name}
          </span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Need help with an order, product, or technical question? Our support
          team is ready to help.
        </p>
      </div>
    </section>
  );
}
