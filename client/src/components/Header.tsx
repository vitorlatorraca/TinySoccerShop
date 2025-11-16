import { Link } from "wouter";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Shield } from "lucide-react";

interface HeaderProps {
  cartItemCount: number;
  favoritesCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount, onCartClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuCategories = [
    { name: "Christmas Jumpers" },
    { name: "New in" },
    { name: "Classic", hasSubmenu: true },
    { name: "Clearance" },
    { name: "Current Season" },
    { name: "Weekly Deals" },
    { name: "Premier League", hasSubmenu: true },
    { name: "Serie A", hasSubmenu: true },
    { name: "La Liga", hasSubmenu: true },
    { name: "Bundesliga", hasSubmenu: true },
    { name: "Ligue 1", hasSubmenu: true },
    { name: "MLS", hasSubmenu: true },
  ];

  const categories = [
    { name: "Football Tops", path: "/shop/football-tops" },
    { name: "Football Bottoms", path: "/shop/football-bottoms" },
    { name: "Football Accessories", path: "/shop/football-accessories" },
    { name: "Rugby", path: "/shop/rugby" },
    { name: "Basketball", path: "/shop/basketball" },
    { name: "Other Sports", path: "/shop/other-sports" },
    { name: "Shop All", path: "/shop/all" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="bg-[#1a5d2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-3" data-testid="link-home">
              <div className="flex h-10 w-10 items-center justify-center text-white">
                <Shield className="h-8 w-8" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-white text-xl font-bold leading-tight">TINY</span>
                <span className="text-white text-xl font-bold leading-tight">SOCCER</span>
                <span className="text-white text-xl font-bold leading-tight">SHOP</span>
              </div>
            </Link>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search entire store here..."
                  className="h-10 w-full pl-4 pr-10 border-0 border-b-2 border-white bg-transparent text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white rounded-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
              </div>
            </div>

            {/* Menu & Cart - Right */}
            <div className="flex items-center gap-4">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="button-mobile-menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col">
                    {menuCategories.map((cat, index) => (
                      <div key={cat.name} className="border-b border-gray-200">
                        <Link 
                          href="/shop/all" 
                          className="flex items-center justify-between px-4 py-4 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          <span>{cat.name}</span>
                          {cat.hasSubmenu && <ChevronDown className="h-4 w-4 text-gray-400" />}
                        </Link>
                      </div>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
                onClick={onCartClick}
                data-testid="button-cart"
              >
                <ShoppingCart className="h-6 w-6" />
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
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar - Categories */}
      <div className="bg-[#1a5d2e] border-b border-[#0d2818]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex h-12 items-center gap-6 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <Link 
                key={cat.path} 
                href={cat.path} 
                className="whitespace-nowrap text-sm font-semibold text-white hover:text-white/80 transition-colors relative group"
              >
                {cat.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
