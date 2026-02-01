import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemCount: number;
  favoritesCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur border-b border-border/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-baseline gap-4">
            <Link href="/" className="group flex items-baseline gap-3" data-testid="link-home">
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">TinySoccerShop</span>
              <span className="archive-brand text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-foreground group-hover:opacity-90">
                The Archive
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <a href="#explore" className="hover:text-foreground transition-colors">
                Explore
              </a>
              <span aria-hidden="true">—</span>
              <a href="#shop" className="hover:text-foreground transition-colors">
                Shop
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-none hover:bg-foreground/5"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[10px]"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
