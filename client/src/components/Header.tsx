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

interface HeaderProps {
  cartItemCount: number;
  favoritesCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount, favoritesCount, onCartClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">TSS</span>
              </div>
              <span className="hidden text-xl font-bold sm:inline-block">TinySoccerShop</span>
            </Link>

            <nav className="hidden lg:flex lg:gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-leagues-menu">
                    Ligas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem data-testid="menu-item-premier-league">Premier League</DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-la-liga">La Liga</DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-serie-a">Serie A</DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-bundesliga">Bundesliga</DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-ligue-1">Ligue 1</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-clubs-menu">
                    Clubes
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem data-testid="menu-item-barcelona">Barcelona</DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-real-madrid">Real Madrid</DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-manchester-united">Manchester United</DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-liverpool">Liverpool</DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-item-bayern">Bayern Munich</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" asChild data-testid="button-national-teams">
                <Link href="/?category=national-teams">
                  Seleções
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild data-testid="button-new-arrivals">
                <Link href="/?sort=newest">
                  Novidades
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild className="text-accent" data-testid="button-promotions">
                <Link href="/?featured=true">
                  Promoções
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar camisas..."
                className="h-10 w-64 pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-search-mobile">
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" data-testid="button-account">
              <User className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative" data-testid="button-favorites">
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
              className="relative"
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
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
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
    </header>
  );
}
