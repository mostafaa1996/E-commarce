import { ArrowRight } from "lucide-react";

export default function LandingSection({
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <section className="container mx-auto px-4 py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action && (
          <a
            href="#"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            {action}
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
      {children}
    </section>
  );
}
