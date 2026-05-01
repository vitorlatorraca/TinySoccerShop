import { Link } from "wouter";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  cartItemCount: number;
  favoritesCount: number;
  onCartClick: () => void;
}

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Football Tops", href: "/shop?category=football-tops" },
  { label: "Football Bottoms", href: "/shop?category=football-bottoms" },
  { label: "Football Accessories", href: "/shop?category=football-accessories" },
  { label: "Rugby", href: "/shop?category=rugby" },
  { label: "Basketball", href: "/shop?category=basketball" },
  { label: "Other Sports", href: "/shop?category=other" },
  { label: "Sale", href: "/shop?sale=true" },
  { label: "Shop All", href: "/shop" },
];

export function Header({ cartItemCount, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[color:var(--color-black)] text-white border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-[72px] items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="group shrink-0 flex items-center"
            data-testid="link-home"
          >
            <span className="font-display text-2xl sm:text-[1.75rem] tracking-[0.04em] uppercase text-white transition-opacity group-hover:opacity-80">
              TinySoccer<span className="text-[color:var(--color-green-light)]">Shop</span>
            </span>
          </Link>

          {/* Centered nav */}
          <nav
            className="hidden xl:flex flex-1 items-center justify-center gap-7 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-200 hover:text-[color:var(--color-green-light)] ${
                  item.label === "Sale" ? "text-[color:var(--color-red)]" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="h-10 w-10 rounded-full inline-flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Account"
              className="h-10 w-10 rounded-full inline-flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <User className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Cart"
              onClick={onCartClick}
              data-testid="button-cart"
              className="relative h-10 w-10 rounded-full inline-flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {cartItemCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[color:var(--color-green-dark)] text-white text-[10px] font-semibold px-1"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="xl:hidden h-10 w-10 rounded-full inline-flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Inline search bar (toggle) */}
        {searchOpen && (
          <div className="pb-3 animate-fade-in">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="search"
                autoFocus
                placeholder="Search jerseys, clubs, eras..."
                className="w-full h-11 pl-11 pr-4 rounded-full bg-white/[0.08] border border-white/15 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[color:var(--color-green-light)] transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile dropdown nav */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 bg-[color:var(--color-black)] animate-fade-in">
          <nav className="container mx-auto px-4 py-5 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/85 hover:text-[color:var(--color-green-light)] transition-colors ${
                  item.label === "Sale" ? "text-[color:var(--color-red)]" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
