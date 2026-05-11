import {
  BadgeCheck,
  CreditCard,
  Headphones,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import LandingSection from "./LandingSection";

const benefits = [
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Free delivery on orders over $50, same-day in major cities.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    desc: "256-bit encryption keeps your payment data safe.",
  },
  {
    icon: BadgeCheck,
    title: "Genuine Products",
    desc: "100% authentic with full manufacturer warranty.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "30-day no-questions-asked return policy.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Real humans ready to help, anytime.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    desc: "Cards, wallets, and installment options.",
  },
];

export default function BenefitsSection() {
  return (
    <LandingSection
      title="Why Choose ShopLite"
      subtitle="Built around what matters most to you"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-400 text-primary-foreground">
              <benefit.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold">{benefit.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {benefit.desc}
            </p>
          </div>
        ))}
      </div>
    </LandingSection>
  );
}
