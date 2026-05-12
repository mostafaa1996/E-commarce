import { ArrowRight, Headphones, Laptop, Watch } from "lucide-react";
import { AdminButton } from "@/components/adminUI/AdminButton";
import { Skeleton } from "@/components/adminUI/skeleton";
import Countdown from "./Countdown";
import { useState, useEffect } from "react";

function DealsBannerSkeleton() {
  return (
    <section className="container mx-auto my-16 px-4">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 md:p-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <Skeleton className="h-7 w-28 rounded-full bg-white/10" />
            <Skeleton className="mt-4 h-10 w-full max-w-md bg-white/10 md:h-14" />
            <Skeleton className="mt-3 h-5 w-full max-w-sm bg-white/10" />
            <Skeleton className="mt-2 h-5 w-3/4 max-w-xs bg-white/10" />
            <div className="mt-6 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-20 rounded-2xl bg-white/10"
                />
              ))}
            </div>
            <Skeleton className="mt-8 h-12 w-40 rounded-full bg-white/10" />
          </div>

          <div className="hidden justify-end gap-4 md:flex">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`${
                  index === 1 ? "mt-8" : index === 2 ? "mt-4" : ""
                } rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur`}
              >
                <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
                <Skeleton className="mt-3 h-4 w-20 bg-white/10" />
                <Skeleton className="mt-2 h-6 w-14 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function calculatePercentage(deal) {
  if (!deal) {
    return 0;
  }
  const { compareAtPrice, price } = deal.variant;
  const percentage = ((compareAtPrice - price) / compareAtPrice) * 100;
  return Math.round(percentage);
}

export default function DealsBannerSection({ deals }) {
  const [activeDeal, setActiveDeal] = useState(null);
  useEffect(() => {
    if (!Array.isArray(deals) || deals.length === 0) {
      return;
    }
    setActiveDeal(deals[0]);
    const interval = setInterval(() => {
      setActiveDeal((currentDeal) => {
        const currentIndex = deals.findIndex((deal) => deal === currentDeal);
        const nextIndex =
          currentIndex === -1 ? 0 : (currentIndex + 1) % deals.length;
        return deals[nextIndex];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [deals]);
  if (!Array.isArray(deals) || deals.length === 0) {
    return <DealsBannerSkeleton />;
  }
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
              Save up to {calculatePercentage(activeDeal)}% on selected{" "}
              {activeDeal?.category} products.
            </p>
            <div className="mt-6">
              <Countdown date={activeDeal?.variant?.expireDate} />
            </div>
            <AdminButton size="lg" className="mt-8 rounded-full px-8">
              View Deals
              <ArrowRight className="ml-2 h-4 w-4" />
            </AdminButton>
          </div>

          <div className="hidden justify-end gap-4 md:flex">
            {deals[0] && (
              <div
                className={`rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur ${
                  deals[0] === activeDeal ? "" : "mt-8"
                }`}
              >
                <img src={deals[0]?.image} className="mx-auto h-30 w-30 text-primary" />
                <p className="mt-3 text-xs text-zinc-400">{deals[0]?.title}</p>
                <p className="text-lg font-bold text-primary">
                  -{calculatePercentage(deals[0])}%
                </p>
              </div>
            )}
            {deals[1] && (
              <div
                className={`rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur ${
                  deals[1] === activeDeal ? "" : "mt-8"
                }`}
              >
                <img src={deals[1]?.image} className="mx-auto h-30 w-30 text-primary" />
                <p className="mt-3 text-xs text-zinc-400">{deals[1]?.title}</p>
                <p className="text-lg font-bold text-primary">
                  -{calculatePercentage(deals[1])}%
                </p>
              </div>
            )}
            {deals[2] && (
              <div
                className={`rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur ${
                  deals[2] === activeDeal ? "" : "mt-8"
                }`}
              >
                <img src={deals[2]?.image} className="mx-auto h-30 w-30 text-primary" />
                <p className="mt-3 text-xs text-zinc-400">{deals[2]?.title}</p>
                <p className="text-lg font-bold text-primary">
                  -{calculatePercentage(deals[2])}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
