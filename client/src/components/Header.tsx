import { Link } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeaderProps {
  cartItemCount: number;
  favoritesCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3" data-testid="link-home">
            <span className="font-display text-xl sm:text-[1.4rem] font-semibold tracking-[-0.03em] text-foreground transition-opacity group-hover:opacity-70">
              TinySoccerShop
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-[0.02em] text-muted-foreground font-medium">
            <a href="#featured" className="hover:text-foreground transition-colors duration-200">
              Collection
            </a>
            <Link href="/shop" className="hover:text-foreground transition-colors duration-200" data-testid="link-go-to-shop">
              Shop
            </Link>
          </nav>

          <div className="flex items-center gap-2">
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

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 rounded-full hover:bg-foreground/5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <a
              href="#featured"
              className="text-lg font-medium text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collection
            </a>
            <Link
              href="/shop"
              className="text-lg font-medium text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
