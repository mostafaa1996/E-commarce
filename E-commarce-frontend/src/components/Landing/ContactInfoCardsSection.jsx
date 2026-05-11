import { Clock, Mail, MapPin, Phone } from "lucide-react";

const infoCards = [
  {
    icon: Mail,
    title: "Email Support",
    value: "support@shoplite.com",
    href: "mailto:support@shoplite.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+20 128 220 2531",
    href: "tel:+201282202531",
  },
  { icon: MapPin, title: "Location", value: "Alexandria, Egypt" },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Sat - Thu, 10:00 AM - 8:00 PM",
  },
];

export default function ContactInfoCardsSection() {
  return (
    <section className="relative z-10 container mx-auto -mt-12 px-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {infoCards.map((card) => {
          const content = (
            <>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-400 text-primary-foreground">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {card.title}
              </p>
              <p className="mt-1 break-words text-sm font-semibold">
                {card.value}
              </p>
            </>
          );

          if (card.href) {
            return (
              <a
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
