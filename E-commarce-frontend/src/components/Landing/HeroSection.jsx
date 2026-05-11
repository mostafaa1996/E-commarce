import {
  ArrowRight,
  BadgeCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { useNavigate } from "react-router-dom";

const trustBadges = [
  { icon: Truck, label: "Fast Delivery" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: BadgeCheck, label: "Original Products" },
  { icon: RefreshCw, label: "Easy Returns" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,24,0.12),transparent_28%),linear-gradient(135deg,#fff7ef_0%,#fffdf9_46%,#fff4e8_100%)]" />
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-300/12 blur-3xl" />
      <div className="absolute inset-y-0 right-0 w-[42%] bg-gradient-to-l from-orange-100/45 via-orange-50/20 to-transparent" />

      <div className="relative container mx-auto grid items-start gap-12 px-4 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            New season tech is here
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Upgrade Your{" "}
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Tech Life
            </span>{" "}
            with ShopLite
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Discover the latest laptops, smartphones, accessories, and smart
            devices at competitive prices.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <AdminButton
              onClick={() => {
                navigate("/shop");
              }}
              size="lg"
              className="rounded-full px-7"
            >
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </AdminButton>
            <AdminButton
              size="lg"
              variant="outline"
              className="rounded-full px-7"
            >
              Explore Deals
            </AdminButton>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-primary">
                  <badge.icon className="h-4 w-4" />
                </span>
                <span className="font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-8 rounded-full bg-primary/10 blur-3xl" />
          <img
            src="https://res.cloudinary.com/ddakfzldm/image/upload/v1778520479/Products_image.png"
            alt="Our products"
            className="relative block h-auto w-full max-w-[680px] object-contain drop-shadow-[0_30px_50px_rgba(255,122,24,0.18)] [mask-image:radial-gradient(circle_at_center,black_60%,transparent_92%),linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%),linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [mask-composite:intersect] [-webkit-mask-image:radial-gradient(circle_at_center,black_60%,transparent_92%),linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%),linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-composite:source-in]"
          />
        </div>
      </div>
    </section>
  );
}
