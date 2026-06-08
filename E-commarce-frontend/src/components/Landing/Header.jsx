import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X, Zap , LogOut } from "lucide-react";
import { useState } from "react";
import { AdminButton } from "@/components/adminUI/AdminButton";
import InputField from "@/components/genericComponents/InputField";
import { useNavigate } from "react-router-dom";

function isActiveLink(to, location) {
  const url = new URL(to, window.location.origin);

  const samePath = location.pathname === url.pathname;
  const sameSearch = location.search === url.search;
  const sameHash = location.hash === url.hash;

  if (url.hash) return samePath && sameHash;
  if (url.search) return samePath && sameSearch;

  return samePath && !location.hash && !location.search;
}

export default function Header({ cartTotal = 0, loggedIn = false , links , logoutAction}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <Link
          to="/home"
          className="flex items-center gap-2 font-bold text-lg shrink-0"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-400 text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <div className="flex items-center gap-1 text-xl font-bold tracking-tight">
            <span className="text-foreground">Shop</span>
            <span className="text-primary">Lite</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {links.map((l) => {
            const active = isActiveLink(l.to, location);

            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <InputField
              placeholder="Search for products, brands..."
              className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <AdminButton
            onClick={() => navigate("/profile/wishlist")}
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </AdminButton>
          <AdminButton
            onClick={() => navigate("/cart")}
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {cartTotal}
            </span>
          </AdminButton>
          <AdminButton
            onClick={() => navigate("/profile")}
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </AdminButton>
          {!loggedIn && (
            <AdminButton
              onClick={() => navigate("/login")}
              className="hidden md:inline-flex ml-2"
            >
              Login
            </AdminButton>
          )}
          {loggedIn && (
            <AdminButton
              onClick={() => {
                logoutAction();
                navigate("/login");
              }}
              variant="ghost"
              className={`w-[30px] aspect-square cursor-pointer
           hover:scale-110 transition duration-200 ease-in-out
          `}
            >
              <LogOut className="h-10 w-10" />
            </AdminButton>
          )}
          <AdminButton
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </AdminButton>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            <div className="relative md:hidden mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <InputField placeholder="Search products..." className="pl-9" />
            </div>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            <AdminButton className="mt-2">Login / Sign up</AdminButton>
          </div>
        </div>
      )}
    </header>
  );
}
