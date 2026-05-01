import { Link } from "wouter";
import { ShoppingCart, ArrowLeft, Search, User } from "lucide-react";

interface ShopHeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Football Tops", href: "/shop?category=football-tops" },
  { label: "Football Bottoms", href: "/shop?category=football-bottoms" },
  { label: "Rugby", href: "/shop?category=rugby" },
  { label: "Basketball", href: "/shop?category=basketball" },
  { label: "Sale", href: "/shop?sale=true" },
  { label: "Shop All", href: "/shop" },
];

export function ShopHeader({
  cartItemCount,
  onCartClick,
  searchQuery = "",
  onSearchChange,
}: ShopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[color:var(--color-black)] text-white border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-[72px] items-center gap-4 lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] font-semibold text-white/80 hover:text-white transition-colors duration-200 shrink-0"
            data-testid="link-back-to-collection"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <Link
            href="/"
            className="hidden md:inline shrink-0 font-display text-xl tracking-[0.04em] uppercase"
          >
            TinySoccer<span className="text-[color:var(--color-green-light)]">Shop</span>
          </Link>

          <nav
            className="hidden xl:flex flex-1 items-center justify-center gap-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80"
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

          <div className="flex-1 xl:flex-none flex items-center justify-end max-w-md">
            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="search"
                placeholder="Search jerseys..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full h-10 pl-11 pr-4 rounded-full bg-white/[0.08] border border-white/15 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[color:var(--color-green-light)] transition-colors"
                aria-label="Search products"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
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
          </div>
        </div>
      </div>
    </header>
  );
}
