import { ArrowRight, Headphones, Laptop, Watch } from "lucide-react";
import { AdminButton } from "@/components/adminUI/AdminButton";
import Countdown from "./Countdown";

export default function DealsBannerSection() {
  return (
    <section className="container mx-auto my-16 px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 text-white md:p-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              Limited Time
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">
              Limited Time Electronics Deals
            </h2>
            <p className="mt-3 max-w-md text-zinc-300">
              Save up to 40% on selected laptops, headphones, and smart
              watches.
            </p>
            <div className="mt-6">
              <Countdown />
            </div>
            <AdminButton size="lg" className="mt-8 rounded-full px-8">
              View Deals
              <ArrowRight className="ml-2 h-4 w-4" />
            </AdminButton>
          </div>

          <div className="hidden justify-end gap-4 md:flex">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
              <Laptop className="mx-auto h-16 w-16 text-primary" />
              <p className="mt-3 text-xs text-zinc-400">Laptops</p>
              <p className="text-lg font-bold text-primary">-30%</p>
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
              <Watch className="mx-auto h-16 w-16 text-primary" />
              <p className="mt-3 text-xs text-zinc-400">Watches</p>
              <p className="text-lg font-bold text-primary">-40%</p>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
              <Headphones className="mx-auto h-16 w-16 text-primary" />
              <p className="mt-3 text-xs text-zinc-400">Audio</p>
              <p className="text-lg font-bold text-primary">-25%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
