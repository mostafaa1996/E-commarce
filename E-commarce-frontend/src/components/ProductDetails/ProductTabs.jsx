import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {extractProductDescription} from "@/utils/StripHTML";

const tabs = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specifications" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
];

const ProductTabs = ({ product }) => {
  const [active, setActive] = useState("description");
  const [openMobile, setOpenMobile] = useState("description");

  const renderContent = (id) => {
    switch (id) {
      case "description": {
        const { intro, bullets } = extractProductDescription(product.description);
        return (
          <div className="space-y-3 text-md text-muted-foreground">
            <p>{intro}</p>
            <ul className="list-disc pl-5 space-y-1 ml-9">
              {bullets.map((item, index) => (
                <li key={`Product-Details-Description-Tab-Bullet-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        );
      }
      case "specs":
        return (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <tbody className="divide-y divide-border">
                {product.specifications.map((s, i) => (
                  <tr key={s.name} className={i % 2 === 0 ? "bg-secondary/30" : "bg-background"}>
                    <td className="w-1/3 px-5 py-3.5 text-sm font-semibold text-muted-foreground">{s.name}</td>
                    <td className="px-5 py-3.5 text-sm text-foreground">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "shipping":
        return (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Ships from <strong className="text-foreground">{product.shipping.shipsFrom}</strong>. Orders are processed within 1 business day.</p>
            <p>Estimated delivery between <strong className="text-foreground">{new Date(product.shipping.estimatedDeliveryMinDate).toLocaleDateString()}</strong> and <strong className="text-foreground">{new Date(product.shipping.estimatedDeliveryMaxDate).toLocaleDateString()}</strong>.</p>
            <p>International shipping rates vary by destination. Free shipping within the United States on this product.</p>
          </div>
        );
      case "returns":
        return (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{product.returnPolicy.notes}</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Return window: <strong className="text-foreground">{product.returnPolicy.returnWindowDays} days</strong></li>
              <li>Return fees paid by: <strong className="text-foreground capitalize">{product.returnPolicy.returnFeesPaidBy}</strong></li>
              <li>Item must be unused and in original packaging</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="container py-12 md:py-16">
      {/* Desktop tabs */}
      <div className="hidden md:block">
        <div className="border-b border-border">
          <nav className="-mb-px flex gap-8">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`relative border-b-2 px-1 py-4 text-sm font-semibold transition-smooth ${
                  active === t.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="animate-fade-in pt-8">{renderContent(active)}</div>
      </div>

      {/* Mobile accordion */}
      <div className="space-y-3 md:hidden">
        {tabs.map((t) => (
          <div key={t.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <button
              onClick={() => setOpenMobile(openMobile === t.id ? null : t.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-base font-semibold text-foreground">{t.label}</span>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openMobile === t.id ? "rotate-180" : ""}`} />
            </button>
            {openMobile === t.id && <div className="border-t border-border px-5 py-5">{renderContent(t.id)}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductTabs;
