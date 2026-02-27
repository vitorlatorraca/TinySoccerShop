import { Link } from "wouter";
import { ShoppingCart, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopHeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export function ShopHeader({
  cartItemCount,
  onCartClick,
  searchQuery = "",
  onSearchChange,
}: ShopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 shrink-0"
            data-testid="link-back-to-collection"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Collection</span>
          </Link>

          <div className="flex-1 flex items-center justify-center max-w-lg mx-auto">
            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search jerseys..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full h-10 pl-11 pr-4 rounded-full bg-foreground/[0.04] border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 transition-all duration-200"
                aria-label="Search products"
              />
            </div>
          </div>

          <div className="flex items-center shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full hover:bg-foreground/5 transition-colors duration-200"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {cartItemCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-foreground text-background text-[10px] font-semibold px-1"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
