import { Star } from "lucide-react";
import LandingSection from "./LandingSection";

export default function TestimonialsSection({ testimonials }) {
  return (
    <LandingSection
      title="What Our Customers Say"
      subtitle="Real reviews from real shoppers"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index <= testimonial.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              "{testimonial.text}"
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-400 text-sm font-bold text-primary-foreground">
                {testimonial.initials}
              </div>
              <div>
                <p className="text-sm font-semibold">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">
                  Purchased: {testimonial.product}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </LandingSection>
  );
}
