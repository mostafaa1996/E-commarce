import { Link } from "react-router-dom";
import { Zap, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const cols = [
  { title: "Shop", links: ["Laptops", "Smartphones", "Accessories", "Smart Watches", "Deals"] },
  { title: "Support", links: ["Contact Us", "Shipping", "Returns", "FAQs", "Warranty"] },
  { title: "Company", links: ["About", "Privacy Policy", "Terms"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-400 text-primary-foreground">
                <Zap className="h-4 w-4" />
              </span>
              ShopLite
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Your trusted destination for premium electronics, gadgets, and smart devices at competitive prices.
            </p>
            <div className="flex gap-2 mt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((I, i) => (
                <a key={i} href="#" aria-label="social" className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold text-sm mb-4">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ShopLite. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>We accept:</span>
            {["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map((p) => (
              <span key={p} className="px-2 py-1 rounded bg-background border border-border font-semibold">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
