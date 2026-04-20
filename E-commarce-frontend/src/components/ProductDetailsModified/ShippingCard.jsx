import { MapPin, Calendar, Globe } from "lucide-react";

const formatRange = (min, max) => {
  const opts = { month: "short", day: "numeric" };
  const a = new Date(min).toLocaleDateString("en-US", opts);
  const b = new Date(max).toLocaleDateString("en-US", opts);
  return `${a} – ${b}`;
};

const ShippingCard = ({ shipping, currency = "USD" }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
    <h3 className="mb-4 text-base font-bold tracking-tight text-foreground">Shipping & Delivery</h3>
    <div className="space-y-3 text-sm">
      <Row icon={<MapPin className="h-4 w-4" />} label="Ships from" value={shipping.shipsFrom} />
      <Row
        icon={<Calendar className="h-4 w-4" />}
        label="Estimated delivery"
        value={formatRange(shipping.estimatedDeliveryMinDate, shipping.estimatedDeliveryMaxDate)}
      />
    </div>

    <div className="mt-5 border-t border-border pt-4">
      <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Globe className="h-3.5 w-3.5" />
        Shipping rates
      </div>
      <ul className="divide-y divide-border/70">
        {shipping.costs.map((c) => (
          <li key={c.shipsTo} className="flex items-center justify-between py-2 text-sm">
            <span className="text-foreground">{c.shipsTo}</span>
            <span className={`font-semibold ${c.cost === 0 ? "text-success" : "text-foreground"}`}>
              {c.cost === 0 ? "Free" : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(c.cost)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Row = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-secondary text-muted-foreground">{icon}</div>
    <div className="flex-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  </div>
);

export default ShippingCard;
