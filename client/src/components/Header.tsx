import { Link } from "wouter";
import { Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TopBar } from "./TopBar";

interface HeaderProps {
  cartItemCount: number;
  favoritesCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount, favoritesCount, onCartClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <TopBar />
      <div className="bg-[#1a5d2e] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-6 lg:gap-8">
              <Link href="/" className="flex items-center gap-2" data-testid="link-home">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
                  <span className="text-lg font-bold text-white">⚽</span>
                </div>
                <span className="hidden text-xl font-bold text-white sm:inline-block">TinySoccerShop</span>
              </Link>

            </div>

            <div className="flex flex-1 items-center justify-center px-4">
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
                <Input
                  type="search"
                  placeholder="Search entire store here..."
                  className="h-12 w-full bg-white/10 border-white/20 pl-10 pr-4 text-white placeholder:text-white/70 focus:bg-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="button-account">
                <User className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10" data-testid="button-favorites">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
                    data-testid="badge-favorites-count"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
                onClick={onCartClick}
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
                    data-testid="badge-cart-count"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="button-mobile-menu">
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <nav className="flex flex-col gap-4 pt-8">
                    <div className="pb-4">
                      <Input
                        type="search"
                        placeholder="Buscar camisas..."
                        className="w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        data-testid="input-search-mobile"
                      />
                    </div>
                    <Link href="/?league=premier-league">
                      <a className="block rounded-md px-3 py-2 text-sm font-medium hover-elevate" data-testid="mobile-link-premier-league">
                        Premier League
                      </a>
                    </Link>
                    <Link href="/?league=la-liga">
                      <a className="block rounded-md px-3 py-2 text-sm font-medium hover-elevate" data-testid="mobile-link-la-liga">
                        La Liga
                      </a>
                    </Link>
                    <Link href="/?league=serie-a">
                      <a className="block rounded-md px-3 py-2 text-sm font-medium hover-elevate" data-testid="mobile-link-serie-a">
                        Serie A
                      </a>
                    </Link>
                    <Link href="/?category=national-teams">
                      <a className="block rounded-md px-3 py-2 text-sm font-medium hover-elevate" data-testid="mobile-link-national-teams">
                        Seleções Nacionais
                      </a>
                    </Link>
                    <Link href="/?sort=newest">
                      <a className="block rounded-md px-3 py-2 text-sm font-medium hover-elevate" data-testid="mobile-link-new-arrivals">
                        Novidades
                      </a>
                    </Link>
                    <Link href="/?featured=true">
                      <a className="block rounded-md px-3 py-2 text-sm font-medium text-accent hover-elevate" data-testid="mobile-link-promotions">
                        Promoções
                      </a>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar - White */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex h-14 items-center gap-6 overflow-x-auto">
            <Link href="/?sort=newest" className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              New in
            </Link>
            <Link href="/?featured=true" className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Classic Sale
            </Link>
            <Link href="/?featured=true" className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Weekly Deals
            </Link>
            <Link href="/?type=classic" className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Classic
            </Link>
            <Link href="/?type=current" className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Current Season
            </Link>
            <Link href="/?condition=clearance" className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Clearance
            </Link>
            <Link href="/?sort=price-asc" className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Price Drops
            </Link>
            <Link href="/?condition=warehouse" className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Warehouse Clearance
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
