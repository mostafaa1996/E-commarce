import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { useState } from "react";

const TopNav = ({ cartCount = 2 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-1 text-xl font-bold tracking-tight">
            <span className="text-foreground">Shop</span>
            <span className="text-primary">Lite</span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {["Home", "Shop", "Pages", "About", "Contact"].map((l) => (
              <a key={l} href="#" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">
                {l}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden flex-1 max-w-md md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products, brands…"
              className="h-10 w-full rounded-full border border-border bg-secondary/60 pl-10 pr-4 text-sm outline-none transition-smooth placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground md:hidden">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Account" className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground">
            <User className="h-5 w-5" />
          </button>
          <button aria-label="Wishlist" className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground">
            <Heart className="h-5 w-5" />
          </button>
          <button aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-glow">
                {cartCount}
              </span>
            )}
          </button>
          <button aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
